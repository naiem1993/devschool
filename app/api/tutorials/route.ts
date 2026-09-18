import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { paginationSchema, searchSchema, validateQuery } from '@/lib/validators'

/**
 * GET /api/tutorials
 * Query params: page, limit, sort, order, q, category, difficulty
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = Object.fromEntries(searchParams.entries())

  const validated = validateQuery(searchSchema, query)
  if (validated.error) {
    return NextResponse.json(
      { error: 'ইনপুট ভ্যালিডেশন ব্যর্থ', details: validated.error },
      { status: 400 }
    )
  }

  const page = validated.data?.page ?? 1
  const limit = validated.data?.limit ?? 6
  const sort = validated.data?.sort ?? 'createdAt'
  const order = validated.data?.order ?? 'desc'
  const q = validated.data?.q
  const category = validated.data?.category
  const difficulty = validated.data?.difficulty

  const skip = (page - 1) * limit

  try {
    const where: Record<string, unknown> = { isPublished: true }

    if (q) {
      where.AND = [
        { title: { search: q } },
        ...(category ? [{ categoryId: category }] : []),
        ...(difficulty ? [{ difficulty }] : []),
      ]
    } else {
      if (category) where.categoryId = category
      if (difficulty) where.difficulty = difficulty
    }

    const [tutorials, total] = await Promise.all([
      prisma.tutorial.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          viewCount: true,
          duration: true,
          rating: true,
          createdAt: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { [sort]: order },
        skip,
        take: limit,
      }),
      prisma.tutorial.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      tutorials,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error('Tutorial fetch error:', error)
    return NextResponse.json(
      { error: 'টিউটোরিয়াল লোড করতে সমস্যা হচ্ছে' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/tutorials - Create tutorial with Zod validation
 * Nested structure (v3): chapter/lesson আলাদা API থেকে তৈরি হয়।
 */
export async function POST(request: NextRequest) {
  const body = await request.json()

  const result = await import('@/lib/validators').then((m) =>
    m.createTutorialSchema.safeParse(body)
  )

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'ইনপুট ভ্যালিডেশন ব্যর্থ',
        details: result.error.issues.map((e: any) => e.message).join(', '),
      },
      { status: 400 }
    )
  }

  try {
    // contents deprecated — chapter/lesson আলাদা API থেকে যোগ হয়
    const { contents: _contents, ...tutorialData } = result.data
    void _contents

    const tutorial = await prisma.tutorial.create({
      data: tutorialData,
      include: {
        category: { select: { name: true, slug: true } },
      },
    })

    return NextResponse.json(tutorial, { status: 201 })
  } catch (error) {
    console.error('Tutorial create error:', error)
    return NextResponse.json(
      { error: 'টিউটোরিয়াল তৈরি করতে সমস্যা হচ্ছে' },
      { status: 500 }
    )
  }
}
