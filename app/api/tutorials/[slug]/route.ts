import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { slugParamSchema } from '@/lib/validators'

/**
 * GET /api/tutorials/[slug]
 * Returns a single tutorial with all related data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  
  // ─── Validate slug ─────────────────────────────────────────────────────────
  const validation = slugParamSchema.safeParse({ slug })
  if (!validation.success) {
    return NextResponse.json(
      { error: 'অবৈধ টিউটোরিয়াল স্লগ' },
      { status: 400 }
    )
  }
  
  try {
    // ─── Query optimization: Select only what's needed ───────────────────────
    const tutorial = await prisma.tutorial.findUnique({
      where: { slug },
      select: {
        id: true,
        titleBn: true,
        slug: true,
        descriptionBn: true,
        difficulty: true,
        viewCount: true,
        duration: true,
        rating: true,
        isActive: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        // ─── Nested selects for related data ────────────────────────────────
        groups: {
          select: { id: true, titleBn: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        },
        chapters: {
          select: {
            id: true,
            slug: true,
            titleBn: true,
            sortOrder: true,
            groupId: true,
            contentBn: true,
            codeExampleBn: true,
            lessons: {
              select: {
                id: true,
                slug: true,
                titleBn: true,
                contentBn: true,
                codeExampleBn: true,
                sortOrder: true,
              },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
        quizzes: {
          select: {
            id: true,
            questionBn: true,
            explanationBn: true,
            options: {
              select: {
                id: true,
                textBn: true,
                // Don't expose isCorrect to client
              },
              orderBy: { id: 'asc' },
            },
          },
        },
        challenges: {
          select: {
            id: true,
            titleBn: true,
            descriptionBn: true,
            starterCode: true,
            testCases: {
              select: {
                id: true,
                input: true,
                // Don't expose expectedOutput for hidden tests
              },
            },
          },
        },
      },
    })
    
    if (!tutorial) {
      return NextResponse.json(
        { error: 'টিউটোরিয়াল পাওয়া যায়নি' },
        { status: 404 }
      )
    }
    
    // ─── Increment view count using optimized increment ──────────────────────
    await prisma.tutorial.update({
      where: { id: tutorial.id },
      data: { viewCount: { increment: 1 } },
    })
    
    return NextResponse.json(tutorial)
  } catch (error) {
    console.error('Tutorial fetch error:', error)
    return NextResponse.json(
      { error: 'টিউটোরিয়াল লোড করতে সমস্যা হচ্ছে' },
      { status: 500 }
    )
  }
}
