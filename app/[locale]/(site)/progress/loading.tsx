export default function ProgressLoading() {
  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806]">
      <div className="border-b border-[#d3e3d8] dark:border-[#17271d] bg-white dark:bg-[#070d0a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
          <div className="h-10 w-64 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl mb-3" />
          <div className="h-4 w-full max-w-lg bg-[#dfece4] dark:bg-[#101c15] rounded-full" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-[#dfece4] dark:bg-[#101c15] rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
