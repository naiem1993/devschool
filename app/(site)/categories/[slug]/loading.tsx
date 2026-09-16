export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-[#F2FBF4] dark:bg-[#050806]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="h-16 w-16 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl mb-6" />
        <div className="h-12 w-1/2 bg-[#dfece4] dark:bg-[#101c15] rounded-2xl mb-4" />
        <div className="h-4 w-2/3 bg-[#dfece4] dark:bg-[#101c15] rounded-full mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#0a120d] border border-[#d3e3d8] dark:border-[#17271d] rounded-2xl p-5 h-48"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
