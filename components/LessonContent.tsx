import TryIt from './TryIt'
import CalloutBox from './CalloutBox'
import LessonLink from './LessonLink'

/**
 * Lesson content renderer — দুটো ফরম্যাটই handle করে:
 *
 *  ১) MARKER সিস্টেম (পুরনো):
 *     [[tryit]] ... [[/tryit]]         → Try it editor
 *     [[note]] ... [[/note]]           → 🟡 box
 *     [[warn]] ... [[/warn]]           → 🔴 box
 *     [[tip]] ... [[/tip]]             → 🟢 box
 *     [[important]] ... [[/important]] → 🔵 box
 *     [[link:/path|লেখা|green]]         → 🔗 বাটন
 *
 *  ২) INLINE HTML (নতুন RichEditor থেকে):
 *     <span style="background:#FEF3C7">হলুদ</span> — সরাসরি আসে
 *     <a href="...">লিংক</a>
 *     <b>বোল্ড</b>
 */

type Props = {
  content: string
  slug?: string
  /** lesson path for TryIt ↗ button — e.g. "html/basic" or "html/basic/exercises" */
  lessonPath?: string
}

type Token =
  | { kind: 'html'; value: string }
  | { kind: 'tryit'; code: string }
  | { kind: 'callout'; variant: 'note' | 'warn' | 'tip' | 'important'; body: string }
  | { kind: 'link'; href: string; label: string; color: 'green' | 'blue' | 'gray' }

const MARKER_RE =
  /\[\[\s*(tryit|note|warn|tip|important)\s*\]\s*([\s\S]*?)\s*\[\[\s*\/\s*\1\s*\]\]|\[\[\s*link\s*:\s*([^|\]]+?)\s*\|\s*([^|\]]+?)\s*(?:\|\s*(\w+)\s*)?\]\]/g

/** basic XSS safety: strip <script>, on* attrs, javascript: URLs */
function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
}

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
])

const TAG_RE = /<\/?([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^>]*)?\/?>/g

type OpenTag = { name: string; open: string }

/**
 * প্রতি html টুকরোকে self-contained বানায়।
 * আগের টুকরোতে খোলা ট্যাগ থাকলে এই টুকরোর শুরুতে attribute সহ reopen করে,
 * এবং এই টুকরোর শেষে খোলা ট্যাগগুলো বন্ধ করে দেয়।
 */
function balanceHtmlChunks(tokens: Token[]): Token[] {
  const stack: OpenTag[] = []

  return tokens.map((t) => {
    if (t.kind !== 'html') return t

    const reopen = stack.map(({ open }) => open).join('')

    TAG_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = TAG_RE.exec(t.value)) !== null) {
      const raw = m[0]
      const name = m[1].toLowerCase()

      if (VOID_TAGS.has(name)) continue

      if (raw.startsWith('</')) {
        const idx = stack.map((s) => s.name).lastIndexOf(name)
        if (idx !== -1) stack.splice(idx, 1)
      } else if (!raw.endsWith('/>')) {
        stack.push({ name, open: raw })
      }
    }

    const close = [...stack]
      .reverse()
      .map(({ name }) => `</${name}>`)
      .join('')

    return {
      kind: 'html' as const,
      value: reopen + t.value + close,
    }
  })
}

function tokenize(raw: string): Token[] {
  const preprocessed = raw
    .replace(/<blockquote>([\s\S]*?)<\/blockquote>/gi, (_, body) => {
      return `[[note]]\n${body.trim()}\n[[/note]]`
    })
    .replace(
      /<div[^>]*class\s*=\s*(["']?)([^"'>]*\b(note|warn|tip|important|w3-note|w3-warning|w3-info|w3-success|alert)\b[^"']*)\1[^>]*>([\s\S]*?)<\/div>/gi,
      (match, q, cls, keyword, body) => {
        let variant: 'note' | 'warn' | 'tip' | 'important' = 'note'
        const lowerCls = cls.toLowerCase()
        if (lowerCls.includes('warn') || lowerCls.includes('danger') || lowerCls.includes('error') || lowerCls.includes('warning')) {
          variant = 'warn'
        } else if (lowerCls.includes('tip') || lowerCls.includes('success')) {
          variant = 'tip'
        } else if (lowerCls.includes('important') || lowerCls.includes('info')) {
          variant = 'important'
        }
        return `[[${variant}]]\n${body.trim()}\n[[/${variant}]]`
      }
    )

  const tokens: Token[] = []
  let cursor = 0
  let m: RegExpExecArray | null
  MARKER_RE.lastIndex = 0

  while ((m = MARKER_RE.exec(preprocessed)) !== null) {
    const before = preprocessed.slice(cursor, m.index)
    if (before.trim()) tokens.push({ kind: 'html', value: sanitize(before) })

    if (m[1]) {
      const name = m[1]
      const body = (m[2] || '').trim()
      if (name === 'tryit') {
        if (body) tokens.push({ kind: 'tryit', code: body })
      } else {
        tokens.push({
          kind: 'callout',
          variant: name as 'note' | 'warn' | 'tip' | 'important',
          body,
        })
      }
    } else {
      const href = (m[3] || '').trim()
      const label = (m[4] || '').trim() || href
      const colorRaw = (m[5] || 'green').toLowerCase()
      const color = (['green', 'blue', 'gray'] as const).includes(
        colorRaw as 'green' | 'blue' | 'gray'
      )
        ? (colorRaw as 'green' | 'blue' | 'gray')
        : 'green'
      if (href) tokens.push({ kind: 'link', href, label, color })
    }

    cursor = m.index + m[0].length
  }

  const tail = preprocessed.slice(cursor)
  if (tail.trim()) tokens.push({ kind: 'html', value: sanitize(tail) })
  return balanceHtmlChunks(tokens)
}

export default function LessonContent({ content, slug, lessonPath }: Props) {
  const tokens = tokenize(content)
  if (tokens.length === 0) return null

  return (
    <>
      {tokens.map((t, i) => {
        if (t.kind === 'html') {
          return (
            <div
              key={i}
              className="lesson-html"
              dangerouslySetInnerHTML={{ __html: t.value }}
            />
          )
        }
        if (t.kind === 'tryit') {
          return <TryIt key={i} code={t.code} slug={slug} lessonPath={lessonPath} />
        }
        if (t.kind === 'callout') {
          return (
            <CalloutBox key={i} variant={t.variant}>
              {t.body}
            </CalloutBox>
          )
        }
        if (t.kind === 'link') {
          return <LessonLink key={i} href={t.href} label={t.label} color={t.color} />
        }
        return null
      })}
    </>
  )
}
