export default function TutorialLoading() {
  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-40 bg-[#dfece4] dark:bg-[#101c15] rounded-full" />
            <div className="h-12 w-3/4 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl" />
            <div className="h-4 w-full bg-[#dfece4] dark:bg-[#101c15] rounded-full" />
            <div className="h-4 w-2/3 bg-[#dfece4] dark:bg-[#101c15] rounded-full" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#0a120d] border border-[#d3e3d8] dark:border-[#17271d] rounded-3xl p-8 space-y-4"
              >
                <div className="h-6 w-1/2 bg-[#dfece4] dark:bg-[#101c15] rounded-xl" />
                <div className="h-4 w-full bg-[#dfece4] dark:bg-[#101c15] rounded-full" />
                <div className="h-4 w-full bg-[#dfece4] dark:bg-[#101c15] rounded-full" />
                <div className="h-4 w-3/4 bg-[#dfece4] dark:bg-[#101c15] rounded-full" />
              </div>
            ))}
          </div>
          <div className="hidden lg:block animate-pulse">
            <div className="h-96 bg-[#dfece4] dark:bg-[#101c15] rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
