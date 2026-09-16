import Link from 'next/link'

type Color = 'green' | 'blue' | 'gray'

type Props = {
  href: string
  label: string
  color?: Color
}

/**
 * Lesson content-এ [[link:url|label|color]] marker থেকে তৈরি হয়।
 * - internal path (/) হলে Next Link, external (http) হলে <a target=_blank>
 * - external হলে ↗ icon, internal হলে → icon
 */

const STYLES: Record<Color, string> = {
  green:
    'bg-[#22C55E] hover:bg-[#4ADE80] text-[#050806] border-transparent',
  blue:
    'bg-[#3B82F6] hover:bg-[#60A5FA] text-white border-transparent',
  gray:
    'bg-transparent hover:border-[#22C55E] hover:text-[#22C55E] dark:hover:text-[#4ADE80] text-slate-700 dark:text-slate-200 border-slate-300/70 dark:border-slate-700/70',
}

export default function LessonLink({ href, label, color = 'green' }: Props) {
  const isExternal = /^https?:\/\//i.test(href)
  const cls = `my-2 inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[14px] font-bold transition-colors ${STYLES[color]}`

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        <span aria-hidden="true">↗</span>
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={cls}>
      <span aria-hidden="true">→</span>
      {label}
    </Link>
  )
}
