import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import TryIt from './TryIt'
import CalloutBox from './CalloutBox'
import LessonLink from './LessonLink'
import QuizWidget from './QuizWidget'
import type { QuizGroupData } from '@/lib/quiz-data'

type Props = {
  content: string
  slug?: string
  lessonPath?: string
  locale: 'bn' | 'en'
  /** lesson-এর quiz groups (localized) — server থেকে আসে, orderIndex অনুযায়ী sorted */
  quizGroups?: QuizGroupData[]
}

type Token =
  | { kind: 'md'; value: string }
  | { kind: 'tryit'; code: string }
  | { kind: 'callout'; variant: 'note' | 'warn' | 'tip' | 'important'; body: string }
  | { kind: 'link'; href: string; label: string; color: 'green' | 'blue' | 'gray' }
  | { kind: 'quiz' }

const MARKER_RE =
  /\[\[\s*(tryit|note|warn|tip|important)\s*\]\]\s*([\s\S]*?)\s*\[\[\s*\/\s*\1\s*\]\]|\[\[\s*link\s*:\s*([^|\]]+?)\s*\|\s*([^|\]]+?)\s*(?:\|\s*(\w+)\s*)?\]\]|\[\[\s*quiz\s*\]\]/gi

function tokenize(raw: string): Token[] {
  const tokens: Token[] = []
  let cursor = 0
  let m: RegExpExecArray | null
  MARKER_RE.lastIndex = 0

  while ((m = MARKER_RE.exec(raw)) !== null) {
    const before = raw.slice(cursor, m.index)
    if (before.trim()) tokens.push({ kind: 'md', value: before })

    // [[quiz]] marker
    if (/^\[\[\s*quiz\s*\]\]$/i.test(m[0])) {
      tokens.push({ kind: 'quiz' })
    } else if (m[1]) {
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

export default function LessonContent({
  content,
  slug,
  lessonPath,
  locale,
  quizGroups,
}: Props) {
  const tokens = tokenize(content)
  if (tokens.length === 0) return null

  const groups = quizGroups ?? []

  // Precompute which quiz group each [[quiz]] token maps to (render must stay pure)
  const quizOrdinalByToken = new Map<number, number>()
  {
    let ordinal = -1
    tokens.forEach((tk, idx) => {
      if (tk.kind === 'quiz') {
        ordinal += 1
        quizOrdinalByToken.set(idx, ordinal)
      }
    })
  }

  // Markdown code block → TryIt renderer
  const markdownComponents = {
    pre: ({ children }: { children?: React.ReactNode }) => {
      const child = Array.isArray(children) ? children[0] : children
      if (!child || typeof child !== 'object' || !('props' in child)) {
        return <pre>{children}</pre>
      }
      const props = (child as { props: { className?: string; children?: React.ReactNode } }).props
      const className = props.className || ''
      const langMatch = /language-(\w+)/.exec(className)
      const lang = langMatch ? langMatch[1] : ''

      const codeContent =
        typeof props.children === 'string'
          ? props.children
          : Array.isArray(props.children)
          ? props.children.join('')
          : String(props.children ?? '')

      const trimmedCode = codeContent.replace(/\n$/, '')

      if (['html', 'css', 'javascript', 'js'].includes(lang.toLowerCase())) {
        return <TryIt code={trimmedCode} slug={slug} lessonPath={lessonPath} />
      }

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
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.body}</ReactMarkdown>
            </CalloutBox>
          )
        }
        if (t.kind === 'link') {
          return <LessonLink key={i} href={t.href} label={t.label} color={t.color} />
        }
        if (t.kind === 'quiz') {
          const ordinal = quizOrdinalByToken.get(i)
          const group = ordinal === undefined ? undefined : groups[ordinal]
          if (!group || group.questions.length === 0) return null
          return (
            <QuizWidget
              key={`quiz-${group.orderIndex}-${i}`}
              lessonId={`${group.orderIndex}`}
              questions={group.questions}
            />
          )
        }
        return null
      })}
    </>
  )
}
