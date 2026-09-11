/**
 * lib/sandbox-runner.ts
 *
 * Sandboxed code execution — ইউজারের কোড একটা আলাদা `<iframe sandbox="allow-scripts">`-এ
 * চালায়। allow-same-origin নেই, তাই iframe একটা opaque origin পায় এবং parent-এর
 * DOM / localStorage / cookie কিছুই পড়তে পারে না।
 *
 * নিরাপত্তা স্তর:
 *  ১. sandbox="allow-scripts" (allow-same-origin ছাড়া) → origin isolation
 *  ২. event.source === iframe.contentWindow → শুধু আমাদের iframe-এর message গ্রহণ
 *  ৩. nonce → user code parent-এ ভুয়া result পাঠাতে পারবে না
 *  ৪. addEventListener (window + prototype) override → user code নিজে message listener বসাতে পারবে না
 *  ৫. 50KB size limit + timeout → parent ট্যাব কখনো হ্যাং হবে না
 */

export type SandboxMode = 'playground' | 'challenge'

export type SandboxResult = {
  output: string
  error?: string
}

/** সর্বোচ্চ কোড সাইজ (bytes)। এর বেশি হলে reject। */
export const MAX_CODE_BYTES = 50 * 1024 // 50KB

/** Playground-এ একবার রানের সর্বোচ্চ সময়। */
export const TIMEOUT_PLAYGROUND_MS = 5000

/** Challenge-এ প্রতি test case-এর সর্বোচ্চ সময়। */
export const TIMEOUT_CHALLENGE_MS = 3000

/** Challenge-এ মোট সব test মিলিয়ে সর্বোচ্চ সময় (caller-এ প্রয়োগ করার জন্য)। */
export const TIMEOUT_CHALLENGE_TOTAL_MS = 30000

/**
 * Runner HTML — এটাই iframe-এর ভেতরের নিরাপদ template।
 * (এটা ইউজারের কোড নয়; আমরা লিখেছি।)
 *
 * String.raw ব্যবহার করা হলো যাতে `\n`, `\u203a` ইত্যাদি escape দ্বিগুণ না হয়ে
 * সরাসরি browser-এর JS parser-এ পৌঁছায়।
 */
const RUNNER_HTML = String.raw`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<script>
(function(){
  var origAdd = window.addEventListener.bind(window);

  function fmt(args){
    var out = [];
    for (var i = 0; i < args.length; i++){
      var a = args[i];
      if (a && typeof a === 'object'){
        try { out.push(JSON.stringify(a, null, 2)); }
        catch(e){ out.push(String(a)); }
      } else {
        out.push(String(a));
      }
    }
    return out.join(' ');
  }

  // রানারের নিজের listener — override-এর আগে বসানো
  origAdd('message', function(e){
    var d = e.data;
    if (!d || d.type !== 'run') return;

    var logs = [];
    var origLog = console.log, origWarn = console.warn, origErr = console.error;
    console.log   = function(){ logs.push('\u203a ' + fmt(arguments)); };
    console.warn  = function(){ logs.push('\u26a0 ' + fmt(arguments)); };
    console.error = function(){ logs.push('\u2717 ' + fmt(arguments)); };

    var result = { type: 'result', nonce: d.nonce, output: '', error: null };

    try {
      var src;
      if (d.mode === 'challenge'){
        src = '"use strict";\n' + d.code +
              '\n;if (typeof solve !== "function"){' +
              ' throw new Error("solve() ফাংশন পাওয়া যায়নি"); }' +
              ' return solve(' + JSON.stringify(d.stdin) + ');';
      } else {
        src = '"use strict";\n' + d.code;
      }

      var fn = new Function(src);
      var r = fn();
      var out = logs.join('\n');
      if (r !== undefined){
        if (d.mode === 'playground') {
          // playground: debug-এর জন্য prefix সহ (console log + return value দেখায়)
          out += (out ? '\n' : '') + '\u21a9 return: ' + fmt([r]);
        } else {
          // challenge: শুধু return value string — যাতে expectedOutput-এর সাথে সরাসরি compare হয়।
          // console.log থাকলে উপেক্ষা করা হয় (test compare-এ হস্তক্ষেপ করবে না)।
          out = fmt([r]);
        }
      }
      result.output = out;
    } catch(err){
      result.error = (err && err.message) ? err.message : String(err);
      result.output = logs.join('\n');
    } finally {
      console.log = origLog; console.warn = origWarn; console.error = origErr;
    }

    try { parent.postMessage(result, '*'); } catch(e){}
  });

  // (৪ক) window.addEventListener override — user code নিজে 'message' listener বসাতে পারবে না
  window.addEventListener = function(type){
    if (type === 'message') return;
    return origAdd.apply(window, arguments);
  };

  // (৪খ) EventTarget.prototype override — সরাসরি prototype কল করে bypass ঠেকাও
  try {
    var origProtoAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type){
      if (type === 'message') return;
      return origProtoAdd.apply(this, arguments);
    };
  } catch(e){}

  // (৪গ) window.onmessage = ... দিয়ে bypass ঠেকাও
  try {
    Object.defineProperty(window, 'onmessage', {
      configurable: false,
      get: function(){ return null; },
      set: function(){ /* ignore */ }
    });
  } catch(e){}
})();
</script>
</body>
</html>`

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function makeNonce(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch {
    /* ignore */
  }
  return Math.random().toString(36).slice(2) + '-' + Date.now().toString(36)
}

/**
 * ইউজারের কোড একটা sandboxed iframe-এ চালায়।
 *
 * @param code     ইউজারের কোড (string)
 * @param stdin    challenge মোডে solve(input)-এ পাঠানোর input
 * @param mode     'playground' (console capture) | 'challenge' (solve() call)
 * @param timeoutMs  সর্বোচ্চ সময় (default: mode অনুযায়ী)
 */
export function runInSandbox(
  code: string,
  stdin: string = '',
  mode: SandboxMode = 'playground',
  timeoutMs: number = mode === 'challenge' ? TIMEOUT_CHALLENGE_MS : TIMEOUT_PLAYGROUND_MS
): Promise<SandboxResult> {
  // (৫) size limit
  const byteLen = typeof TextEncoder !== 'undefined'
    ? new TextEncoder().encode(code).length
    : code.length
  if (byteLen > MAX_CODE_BYTES) {
    return Promise.resolve({
      output: '',
      error: `কোড অনেক বড় (${Math.round(byteLen / 1024)}KB)। সর্বোচ্চ ${MAX_CODE_BYTES / 1024}KB অনুমোদিত।`,
    })
  }

  if (!isBrowser()) {
    return Promise.resolve({ output: '', error: 'sandbox শুধু ব্রাউজারে চলে' })
  }

  return new Promise<SandboxResult>((resolve) => {
    const iframe = document.createElement('iframe')
    // (১) allow-same-origin নেই — এটাই মূল সুরক্ষা
    iframe.setAttribute('sandbox', 'allow-scripts')
    iframe.setAttribute('title', 'sandbox-runner')
    iframe.style.display = 'none'
    iframe.srcdoc = RUNNER_HTML

    const nonce = makeNonce()
    let settled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('message', onMessage)
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
    }

    const finish = (result: SandboxResult) => {
      if (settled) return
      settled = true
      cleanup()
      resolve(result)
    }

    // (২) source verify + (৩) nonce verify
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframe.contentWindow) return
      const d = e.data as { type?: string; nonce?: string; output?: unknown; error?: unknown } | null
      if (!d || d.type !== 'result') return
      if (d.nonce !== nonce) return
      finish({
        output: typeof d.output === 'string' ? d.output : '',
        error: typeof d.error === 'string' && d.error ? d.error : undefined,
      })
    }
    window.addEventListener('message', onMessage)

    iframe.onload = () => {
      if (settled) return
      try {
        iframe.contentWindow?.postMessage(
          { type: 'run', code, stdin, mode, nonce },
          '*'
        )
      } catch {
        finish({ output: '', error: 'sandbox-এ কোড পাঠানো যায়নি' })
      }
    }

    // (৫) timeout — parent ট্যাব রক্ষা
    timeoutId = setTimeout(() => {
      finish({
        output: '',
        error: `Time limit exceeded (${Math.round(timeoutMs / 1000)}s)`,
      })
    }, timeoutMs)

    document.body.appendChild(iframe)
  })
}
