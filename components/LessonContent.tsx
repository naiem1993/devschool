import TryIt from './TryIt'

/**
 * Lesson content থেকে [[tryit]] ... [[/tryit]] marker খুঁজে
 * ঠিক সেই জায়গাগুলোতে TryIt কম্পোনেন্ট বসায়।
 *
 * Marker না থাকলে পুরো content আগের মতোই এক প্যারাগ্রাফ হিসেবে দেখায় —
 * তাই পুরনো lesson-গুলো ভাঙবে না।
 *
 * Admin panel-এ content লেখার সময়:
 *   কিছু টেক্সট...
 *   [[tryit]]
 *   <h1>Hello</h1>
 *   [[/tryit]]
 *   আরও টেক্সট...
 */

const MARKER_RE = /\[\[tryit\]\]([\s\S]*?)\[\[\/tryit\]\]/g

export default function LessonContent({ content }: { content: string }) {
  const nodes: React.ReactNode[] = []
  let cursor = 0
  let key = 0
  let match: RegExpExecArray | null

  MARKER_RE.lastIndex = 0

  while ((match = MARKER_RE.exec(content)) !== null) {
    const before = content.slice(cursor, match.index).trim()
    if (before) {
      nodes.push(
        <p key={`p-${key++}`} className="whitespace-pre-line">
          {before}
        </p>
      )
    }

    const code = match[1].trim()
    if (code) {
      nodes.push(<TryIt key={`t-${key++}`} code={code} />)
    }

    cursor = match.index + match[0].length
  }

  const tail = content.slice(cursor).trim()
  if (tail) {
    nodes.push(
      <p key={`p-${key++}`} className="whitespace-pre-line">
        {tail}
      </p>
    )
  }

  if (nodes.length === 0) return null

  return <>{nodes}</>
}
