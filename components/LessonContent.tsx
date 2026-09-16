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
  chapterNo?: number
}

type Token =
  | { kind: 'html'; value: string }
  | { kind: 'tryit'; code: string }
  | { kind: 'callout'; variant: 'note' | 'warn' | 'tip' | 'important'; body: string }
  | { kind: 'link'; href: string; label: string; color: 'green' | 'blue' | 'gray' }

const MARKER_RE =
  /\[\[(tryit|note|warn|tip|important)\]([\s\S]*?)\[\[\/\1\]\]|\[\[link:([^|\]]+)\|([^|\]]+)(?:\|(\w+))?\]\]/g

/** basic XSS safety: strip <script>, on* attrs, javascript: URLs */
function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
}

function tokenize(raw: string): Token[] {
  const tokens: Token[] = []
  let cursor = 0
  let m: RegExpExecArray | null
  MARKER_RE.lastIndex = 0

  while ((m = MARKER_RE.exec(raw)) !== null) {
    const before = raw.slice(cursor, m.index)
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

  const tail = raw.slice(cursor)
  if (tail.trim()) tokens.push({ kind: 'html', value: sanitize(tail) })
  return tokens
}

export default function LessonContent({ content, slug, chapterNo }: Props) {
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
          return <TryIt key={i} code={t.code} slug={slug} chapterNo={chapterNo} />
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
