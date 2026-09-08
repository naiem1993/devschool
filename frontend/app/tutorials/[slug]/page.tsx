import prisma from '@/lib/prisma';
import LessonSidebar from '@/components/LessonSidebar';

export default async function TutorialPage({ params }: { params: { slug: string } }) {
  let tutorial: any = null;
  let allLessons: any[] = [];

  try {
    tutorial = await prisma.tutorial.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    });

    // সব টিউটোরিয়াল ফেচ করুন (সাইডবারের জন্য)
    allLessons = await prisma.tutorial.findMany({
      where: { isPublished: true, categoryId: tutorial?.categoryId },
      select: { id: true, title: true, slug: true },
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    console.error('Database connection failed:', error);
  }

  if (!tutorial) return <div className="p-8 text-center">টিউটোরিয়াল খুঁজে পাওয়া যায়নি বা ডেটাবেস সংযোগ বিচ্ছিন্ন রয়েছে।</div>;

  return (
    <div className="flex flex-1">
      <LessonSidebar lessons={allLessons} currentSlug={tutorial.slug} />
      <article className="flex-1 p-6 md:p-8 lg:p-12 prose prose-indigo dark:prose-invert max-w-none">
        <h1>{tutorial.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: tutorial.content }} />
      </article>
    </div>
  );
}
