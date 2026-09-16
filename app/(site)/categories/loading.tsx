export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806]">
      {/* Hero skeleton */}
      <div className="border-b border-[#d3e3d8] dark:border-[#17271d] bg-white dark:bg-[#070d0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
          <div className="h-4 w-32 bg-[#dfece4] dark:bg-[#101c15] rounded-full mb-6" />
          <div className="h-12 w-2/3 max-w-md bg-[#dfece4] dark:bg-[#101c15] rounded-2xl mb-4" />
          <div className="h-4 w-full max-w-xl bg-[#dfece4] dark:bg-[#101c15] rounded-full mb-2" />
          <div className="h-4 w-3/4 max-w-lg bg-[#dfece4] dark:bg-[#101c15] rounded-full mb-8" />
          <div className="flex gap-4">
            <div className="h-20 w-28 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl" />
            <div className="h-20 w-28 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl" />
            <div className="h-20 w-28 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-pulse">
        <div className="flex gap-3 mb-8">
          <div className="flex-1 h-12 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl" />
          <div className="w-40 h-12 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#0a120d] border border-[#d3e3d8] dark:border-[#17271d] rounded-3xl p-6 h-56"
            >
              <div className="w-14 h-14 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl mb-4" />
              <div className="h-5 w-2/3 bg-[#dfece4] dark:bg-[#101c15] rounded-full mb-3" />
              <div className="h-4 w-full bg-[#dfece4] dark:bg-[#101c15] rounded-full mb-2" />
              <div className="h-4 w-3/4 bg-[#dfece4] dark:bg-[#101c15] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
