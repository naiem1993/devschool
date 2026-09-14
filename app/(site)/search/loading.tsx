export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806] text-slate-900 dark:text-slate-100">
      <section className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-6" />
          <div className="h-12 w-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse mb-4" />
          <div className="h-5 w-full max-w-2xl bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl animate-pulse" />
          <div className="h-10 w-72 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
          <div className="pt-6 space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5"
              >
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-3 animate-pulse" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
