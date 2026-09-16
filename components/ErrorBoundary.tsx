'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Uncaught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">😵</div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">কিছু একটু ভুল হযেছে</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
              {this.state.error?.message || 'আমরা সমস্যা সমাধানে কাজ করছি।'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-[#22C55E] text-[#050806] rounded-xl hover:bg-[#4ADE80] transition"
            >
              রিফ্রেশ করুন
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
