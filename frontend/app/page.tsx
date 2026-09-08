import Link from 'next/link'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface Tutorial {
  id: string
  title: string
  slug: string
  difficulty: string
  views: number
  category?: { name: string }
}

interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  tutorials?: Tutorial[]
}

export default async function HomePage() {
  let categories: Category[] = []
  let popular: Tutorial[] = []

  try {
    const [catsRes, popRes] = await Promise.all([
      fetch(`${API_BASE_URL}/categories`),
      fetch(`${API_BASE_URL}/tutorials`)
    ])

    if (catsRes.ok) categories = await catsRes.json()
    if (popRes.ok) popular = await popRes.json()
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100">

      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium mb-4">
            🔥 ১০০% ফ্রি — কোনো লগইন প্রয়োজন নেই
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            বিনামূল্যে <br className="sm:hidden" />
            <span className="text-yellow-300">প্রোগ্রামিং</span> শিখুন
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
            HTML, CSS, JavaScript, Python — ইন্টারঅ্যাকটিভ টিউটোরিয়াল, কুইজ ও কোড চ্যালেঞ্জ
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/categories"
              className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              🚀 শুরু করুন
            </Link>
            <Link
              href="/playground"
              className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-full shadow-xl hover:bg-indigo-400 hover:scale-105 transition-all duration-300 border border-white/20"
            >
              ✏️ কোড চেষ্টা করুন
            </Link>
          </div>
          {/* Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/80">
            <div><span className="font-bold text-white">২০+</span> ভাষা</div>
            <div><span className="font-bold text-white">১০০+</span> টিউটোরিয়াল</div>
            <div><span className="font-bold text-white">৫০+</span> কুইজ</div>
            <div><span className="font-bold text-white">১০+</span> চ্যালেঞ্জ</div>
          </div>
        </div>
        {/* wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-12 md:h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C300,100 700,0 1200,60 L1200,120 L0,120 Z" fill="#ffffff" className="dark:fill-[#0a0a0a]" />
          </svg>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 bg-gray-50 dark:bg-[#111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">📂 বিষয় অনুযায়ী শিখুন</h2>
            <Link href="/categories" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium">
              সব দেখুন →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat: Category) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-500"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {(cat.tutorials?.length ?? 0)} টি টিউটোরিয়াল
                    </p>
                  </div>
                  <span className="text-2xl opacity-60 group-hover:opacity-100 transition">
                    {cat.icon || '📘'}
                  </span>
                </div>
                {cat.tutorials && cat.tutorials.length > 0 && (
                  <ul className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {cat.tutorials.slice(0, 3).map((t: Tutorial) => (
                      <li key={t.id}>• {t.title}</li>
                    ))}
                  </ul>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR ===== */}
      <section className="py-16 bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-10">🔥 জনপ্রিয় টিউটোরিয়াল</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popular.slice(0, 6).map((t: Tutorial) => (
              <Link
                key={t.id}
                href={`/tutorials/${t.slug}`}
                className="group bg-gray-50 dark:bg-[#151515] rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-500"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 rounded-full">
                    {t.difficulty}
                  </span>
                  <span className="text-xs text-gray-400">👁️ {t.views}</span>
                </div>
                <h3 className="text-lg font-semibold mt-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                  {t.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t.category?.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA + DONATE ===== */}
      <section className="py-16 bg-indigo-50 dark:bg-indigo-950/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            💝 সাইটটি বিনামূল্যে রাখতে সাহায্য করুন
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            দান করুন বা আমাদের অ্যাড দেখে সাপোর্ট দিন।
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/donate"
              className="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition shadow-md"
            >
              ❤️ দান করুন
            </Link>
            <span className="px-8 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded-full text-gray-500 dark:text-gray-400 text-sm flex items-center">
              📢 অ্যাড স্পেস
            </span>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} DevSchool — ১০০% ফ্রি লার্নিং প্ল্যাটফর্ম
      </footer>
    </div>
  )
}
