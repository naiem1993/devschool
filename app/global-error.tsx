'use client'

// ─────────────────────────────────────────────────────────────
//  DevSchool — Global Error (root-level crash fallback)
//  ⚠️ global-error REPLACES the root layout → must render
//     its own <html> and <body>. Styles inline রাখা safest.
// ─────────────────────────────────────────────────────────────

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global-error]', error)
  }, [error])

  return (
    <html lang="bn" className="dark">
      <body
        style={{
          margin: 0,
          minHeight: '100svh',
          background: '#050806',
          color: '#e6f4ea',
          fontFamily:
            'var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system, Arial, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
        }}
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: '460px', textAlign: 'center' }}>
          {/* glow */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: '-120px',
              transform: 'translateX(-50%)',
              height: '320px',
              width: '420px',
              maxWidth: '120vw',
              background:
                'radial-gradient(ellipse at center, rgba(34,197,94,0.22), transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative' }}>
            {/* warning mark */}
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 1.25rem',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                background: 'rgba(34,197,94,0.12)',
                border: '1px solid rgba(34,197,94,0.35)',
              }}
            >
              ⚠️
            </div>

            <div
              style={{
                fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#4ADE80',
                marginBottom: '0.75rem',
              }}
            >
              Critical Error
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 0.75rem', lineHeight: 1.3 }}>
              সাইটে একটি সমস্যা হয়েছে
            </h1>

            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.7,
                color: '#94a3b8',
                margin: '0 0 1.75rem',
              }}
            >
              অপ্রত্যাশিত একটি ত্রুটি ঘটেছে। নিচের বাটনে ক্লিক করে আবার চেষ্টা করুন।
              সমস্যা থেকে গেলে কিছুক্ষণ পর ফিরে আসুন।
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={reset}
                style={{
                  width: '100%',
                  padding: '13px 24px',
                  background: '#22C55E',
                  color: '#050806',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                আবার চেষ্টা করুন 🔄
              </button>
              <a
                href="/"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  padding: '12px 24px',
                  background: 'transparent',
                  color: '#e6f4ea',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                হোমপেজে ফিরে যান
              </a>
            </div>

            {error?.digest && (
              <p
                style={{
                  marginTop: '1.5rem',
                  fontFamily: 'var(--font-geist-mono), ui-monospace, monospace',
                  fontSize: '10px',
                  color: '#475569',
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
