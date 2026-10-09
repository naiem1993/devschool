import type { ReactNode } from 'react'

type Variant = 'note' | 'warn' | 'tip' | 'important'

type Props = {
  variant: Variant
  children: ReactNode
}

/**
 * Highlight box — lesson content-এ [[note]] [[warn]] [[tip]] [[important]] marker থেকে তৈরি হয়।
 * Theme-aware: light mode-এ হালকা bg + গাঢ় টেক্সট, dark mode-এ গাঢ় bg + হালকা টেক্সট।
 */

const CONFIG: Record<
  Variant,
  { label: string; icon: string; light: string; dark: string }
> = {
  note: {
    label: 'Note',
    icon: '📌',
    light: 'bg-[#ffffcc] border-[#4CAF50] text-gray-900 shadow-sm',
    dark: 'dark:bg-[#ffffcc] dark:border-[#4CAF50] dark:text-gray-900 shadow-sm',
  },
  warn: {
    label: 'সতর্কতা',
    icon: '⚠️',
    light: 'bg-red-50 border-red-400 text-red-900',
    dark: 'dark:bg-red-950/40 dark:border-red-700 dark:text-red-200',
  },
  tip: {
    label: 'টিপ',
    icon: '💡',
    light: 'bg-emerald-50 border-emerald-400 text-emerald-900',
    dark: 'dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-200',
  },
  important: {
    label: 'গুরুত্বপূর্ণ',
    icon: 'ℹ️',
    light: 'bg-blue-50 border-blue-400 text-blue-900',
    dark: 'dark:bg-blue-950/40 dark:border-blue-700 dark:text-blue-200',
  },
}

export default function CalloutBox({ variant, children }: Props) {
  const cfg = CONFIG[variant]
  const isHtml = typeof children === 'string' && /<[a-z][\s\S]*>/i.test(children)

  return (
    <div
      className={`my-4 rounded-lg border-l-4 px-4 py-3 ${cfg.light} ${cfg.dark}`}
    >
      <div className="mb-1 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider opacity-85">
        <span aria-hidden="true">{cfg.icon}</span>
        <span>{cfg.label}</span>
      </div>
      {isHtml ? (
        <div
          className="text-[14.5px] leading-relaxed lesson-html"
          dangerouslySetInnerHTML={{ __html: children as string }}
        />
      ) : (
        <div className="whitespace-pre-line text-[14.5px] leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}
