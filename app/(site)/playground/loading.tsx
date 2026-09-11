export default function PlaygroundLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19]">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-full mb-5" />
          <div className="h-12 w-2/3 max-w-md bg-slate-200 dark:bg-slate-800 rounded-2xl mb-3" />
          <div className="h-4 w-full max-w-xl bg-slate-200 dark:bg-slate-800 rounded-full" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-[520px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-[520px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    </div>
  )
}
