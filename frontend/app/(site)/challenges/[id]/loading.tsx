export default function ChallengeDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-pulse">
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-full mb-6" />
        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-full mb-4" />
        <div className="h-10 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4" />
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-[500px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-[500px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    </div>
  )
}
