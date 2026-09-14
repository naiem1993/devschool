export default function ReferencesLoading() {
  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806]">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-full mb-6" />
          <div className="h-12 w-2/3 max-w-md bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4" />
          <div className="h-4 w-full max-w-xl bg-slate-200 dark:bg-slate-800 rounded-full mb-8" />
          <div className="flex gap-4">
            <div className="h-20 w-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-20 w-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-20 w-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-pulse">
        <div className="space-y-3 mb-8">
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 h-52"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
