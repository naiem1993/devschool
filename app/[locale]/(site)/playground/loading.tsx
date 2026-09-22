export default function PlaygroundLoading() {
  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806]">
      <div className="border-b border-[#d3e3d8] dark:border-[#17271d] bg-white dark:bg-[#070d0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
          <div className="h-4 w-32 bg-[#dfece4] dark:bg-[#101c15] rounded-full mb-5" />
          <div className="h-12 w-2/3 max-w-md bg-[#dfece4] dark:bg-[#101c15] rounded-2xl mb-3" />
          <div className="h-4 w-full max-w-xl bg-[#dfece4] dark:bg-[#101c15] rounded-full" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-[520px] bg-[#dfece4] dark:bg-[#101c15] rounded-3xl" />
          <div className="h-[520px] bg-[#dfece4] dark:bg-[#101c15] rounded-3xl" />
        </div>
      </div>
    </div>
  )
}
