import Link from 'next/link';

type Lesson = {
  id: string;
  title: string;
  slug: string;
};

export default function LessonSidebar({ lessons, currentSlug }: { lessons: Lesson[]; currentSlug?: string }) {
  return (
    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto h-[calc(100vh-4rem)] sticky top-16">
      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        এই টিউটোরিয়ালের অধ্যায়
      </h3>
      <ul className="space-y-1">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/tutorials/${lesson.slug}`}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                lesson.slug === currentSlug
                  ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}