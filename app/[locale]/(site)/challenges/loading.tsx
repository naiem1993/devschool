export default function ChallengesLoading() {
  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806]">
      <div className="border-b border-[#d3e3d8] dark:border-[#17271d] bg-white dark:bg-[#070d0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
          <div className="h-4 w-32 bg-[#dfece4] dark:bg-[#101c15] rounded-full mb-6" />
          <div className="h-12 w-2/3 max-w-md bg-[#dfece4] dark:bg-[#101c15] rounded-2xl mb-4" />
          <div className="h-4 w-full max-w-xl bg-[#dfece4] dark:bg-[#101c15] rounded-full mb-8" />
          <div className="flex gap-4">
            <div className="h-20 w-28 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl" />
            <div className="h-20 w-28 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-pulse">
        <div className="h-12 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl mb-3" />
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (<div key={i} className="h-10 w-20 bg-[#dfece4] dark:bg-[#101c15] rounded-xl" />))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-[#0a120d] border border-[#d3e3d8] dark:border-[#17271d] rounded-3xl p-6 h-48" />
          ))}
        </div>
      </div>
    </div>
  )
}
