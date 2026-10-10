import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import TryIt from './TryIt'
import CalloutBox from './CalloutBox'
import LessonLink from './LessonLink'

type Props = {
  content: string
  slug?: string
  lessonPath?: string
  locale: 'bn' | 'en'
}

type Token =
  | { kind: 'md'; value: string }
  | { kind: 'tryit'; code: string }
  | { kind: 'callout'; variant: 'note' | 'warn' | 'tip' | 'important'; body: string }
  | { kind: 'link'; href: string; label: string; color: 'green' | 'blue' | 'gray' }

const MARKER_RE =
  /\[\[\s*(tryit|note|warn|tip|important)\s*\]\]\s*([\s\S]*?)\s*\[\[\s*\/\s*\1\s*\]\]|\[\[\s*link\s*:\s*([^|\]]+?)\s*\|\s*([^|\]]+?)\s*(?:\|\s*(\w+)\s*)?\]\]/gi

function tokenize(raw: string): Token[] {
  const tokens: Token[] = []
  let cursor = 0
  let m: RegExpExecArray | null
  MARKER_RE.lastIndex = 0

  while ((m = MARKER_RE.exec(raw)) !== null) {
    const before = raw.slice(cursor, m.index)
    if (before.trim()) tokens.push({ kind: 'md', value: before })

    if (m[1]) {
      const name = m[1].toLowerCase()
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
  if (tail.trim()) tokens.push({ kind: 'md', value: tail })
  return tokens
}

export default function LessonContent({ content, slug, lessonPath, locale }: Props) {
  const tokens = tokenize(content)
  if (tokens.length === 0) return null

  // 🟢 Markdown কোড ব্লক গুলোকে TryIt কম্পোনেন্টে রূপান্তর করার custom renderer
  const markdownComponents = {
    // Fenced code block (```html ... ```) ধরার জন্য
    pre: ({ children }: { children?: React.ReactNode }) => {
      // children হলো <code> element। তার ভেতর থেকে class এবং content বের করি
      const child = Array.isArray(children) ? children[0] : children
      if (!child || typeof child !== 'object' || !('props' in child)) {
        return <pre>{children}</pre>
      }
      const props = (child as { props: { className?: string; children?: React.ReactNode } }).props
      const className = props.className || ''
      const langMatch = /language-(\w+)/.exec(className)
      const lang = langMatch ? langMatch[1] : ''

      // কোড extract করি
      const codeContent =
        typeof props.children === 'string'
          ? props.children
          : Array.isArray(props.children)
          ? props.children.join('')
          : String(props.children ?? '')

      const trimmedCode = codeContent.replace(/\n$/, '')

      // HTML / CSS / JS কোড হলে TryIt বানাই
      if (['html', 'css', 'javascript', 'js'].includes(lang.toLowerCase())) {
        return (
          <TryIt code={trimmedCode} slug={slug} lessonPath={lessonPath} />
        )
      }

      // অন্য ভাষা হলে সাধারণ কোড ব্লক হিসেবে দেখাই
      return (
        <pre className="rounded-lg bg-[#050806] text-[#4ADE80] p-4 overflow-x-auto text-sm font-mono border border-emerald-900/30">
          <code>{trimmedCode}</code>
        </pre>
      )
    },
  }

  return (
    <>
      {tokens.map((t, i) => {
        if (t.kind === 'md') {
          return (
            <div
              key={i}
              className="lesson-md prose prose-sm max-w-none dark:prose-invert"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
              >
                {t.value}
              </ReactMarkdown>
            </div>
          )
        }
        if (t.kind === 'tryit') {
          return <TryIt key={i} code={t.code} slug={slug} lessonPath={lessonPath} />
        }
        if (t.kind === 'callout') {
          return (
            <CalloutBox key={i} variant={t.variant} locale={locale}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {t.body}
              </ReactMarkdown>
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