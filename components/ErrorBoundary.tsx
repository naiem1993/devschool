'use client'

// ============================================================
//  ERROR BOUNDARY — i18n-aware (class + functional wrapper)
// ============================================================
//  React-এর নিয়ম: error catching MUST be a class component.
//  তাই দুটো অংশ:
//    1) ErrorBoundaryBase — class, শুধু catch + render করে
//    2) ErrorBoundary     — functional wrapper, useDict() দিয়ে
//                          dictionary inject করে
//
//  ফলে caller আগের মতোই `<ErrorBoundary>...</ErrorBoundary>`
//  ব্যবহার করতে পারে — API অপরিবর্তিত।
// ============================================================

import { Component, ReactNode } from 'react'
import { useDict } from '@/lib/i18n/I18nProvider'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  /** dictionary-র errorBoundary section — wrapper inject করে */
  dict: Dictionary['errorBoundary']
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundaryBase extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    // caller নিজের fallback দিলে সেটাই আগে
    if (this.props.fallback) return this.props.fallback

    const t = this.props.dict

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">😵</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {t.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
            {this.state.error?.message || t.defaultMessage}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-[#22C55E] text-[#050806] rounded-xl hover:bg-[#4ADE80] transition"
          >
            {t.refreshBtn}
          </button>
        </div>
      </div>
    )
  }
}

/**
 * Public API — আগের মতোই props (children + optional fallback)।
 * ভেতরে useDict() দিয়ে localized error UI পাঠায়।
 */
export default function ErrorBoundary({
  children,
  fallback,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const dict = useDict()
  return (
    <ErrorBoundaryBase dict={dict.errorBoundary} fallback={fallback}>
      {children}
    </ErrorBoundaryBase>
  )
}
