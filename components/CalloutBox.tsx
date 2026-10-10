import type { ReactNode } from 'react'

type Variant = 'note' | 'warn' | 'tip' | 'important'
type Locale = 'bn' | 'en'

type Props = {
  variant: Variant
  children: ReactNode
  locale?: Locale
}

/**
 * Highlight box — lesson content-এ [[note]] [[warn]] [[tip]] [[important]] marker থেকে তৈরি হয়।
 * Theme-aware: light mode-এ হালকা bg + গাঢ় টেক্সট, dark mode-এ গাঢ় bg + হালকা টেক্সট।
 * Multi-language: locale prop না দিলে ডিফল্ট 'en'।
 */

const CONFIG: Record<
  Variant,
  { label: Record<Locale, string>; icon: string; light: string; dark: string }
> = {
  note: {
    label: { bn: 'নোট', en: 'Note' },
    icon: '📌',
    light: 'bg-[#ffffcc] border-[#4CAF50] text-gray-900 shadow-sm',
    dark: 'dark:bg-[#ffffcc] dark:border-[#4CAF50] dark:text-gray-900 shadow-sm',
  },
  warn: {
    label: { bn: 'সতর্কতা', en: 'Warning' },
    icon: '⚠️',
    light: 'bg-red-50 border-red-400 text-red-900',
    dark: 'dark:bg-red-950/40 dark:border-red-700 dark:text-red-200',
  },
  tip: {
    label: { bn: 'টিপ', en: 'Tip' },
    icon: '💡',
    light: 'bg-emerald-50 border-emerald-400 text-emerald-900',
    dark: 'dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-200',
  },
  important: {
    label: { bn: 'গুরুত্বপূর্ণ', en: 'Important' },
    icon: 'ℹ️',
    light: 'bg-blue-50 border-blue-400 text-blue-900',
    dark: 'dark:bg-blue-950/40 dark:border-blue-700 dark:text-blue-200',
  },
}

export default function CalloutBox({ variant, children, locale = 'en' }: Props) {
  const cfg = CONFIG[variant]
  const isHtml = typeof children === 'string' && /<[a-z][\s\S]*>/i.test(children)

  return (
    <div
      className={`my-4 rounded-lg border-l-4 px-4 py-3 ${cfg.light} ${cfg.dark}`}
    >
      <div className="mb-1 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider opacity-85">
        <span aria-hidden="true">{cfg.icon}</span>
        <span>{cfg.label[locale] || cfg.label.en}</span>
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