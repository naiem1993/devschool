export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806] text-[#0f172a] dark:text-[#e6f4ea]">
      <section className="border-b border-[#d3e3d8] dark:border-[#17271d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="h-4 w-40 bg-[#dfece4] dark:bg-[#101c15] rounded animate-pulse mb-6" />
          <div className="h-12 w-48 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl animate-pulse mb-4" />
          <div className="h-5 w-full max-w-2xl bg-[#eaf3ed] dark:bg-[#101c15]/60 rounded animate-pulse" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="h-16 bg-white dark:bg-[#0a120d] border border-[#d3e3d8] dark:border-[#17271d] rounded-3xl animate-pulse" />
          <div className="h-10 w-72 bg-[#eaf3ed] dark:bg-[#101c15]/60 rounded-2xl animate-pulse" />
          <div className="pt-6 space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#0a120d] border border-[#d3e3d8] dark:border-[#17271d] rounded-2xl p-5"
              >
                <div className="h-4 bg-[#dfece4] dark:bg-[#101c15] rounded w-1/3 mb-3 animate-pulse" />
                <div className="h-3 bg-[#eaf3ed] dark:bg-[#101c15]/60 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
