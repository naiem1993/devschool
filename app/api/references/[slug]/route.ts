import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { slugParamSchema } from '@/lib/validators'

/**
 * GET /api/references/[slug]
 * Fetches references for a specific category
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
      { error: 'অবৈধ স্লগ' },
      { status: 400 }
    )
  }
  
  try {
    // ─── Query optimization: Select only needed fields ───────────────────────
    const references = await prisma.reference.findMany({
      where: {
        tutorial: { slug },
      },
      select: {
        id: true,
        titleBn: true,
        slug: true,
        descriptionBn: true,
        syntaxBn: true,
        exampleBn: true,
        tags: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    })
    
    return NextResponse.json({
      references,
      total: references.length,
    })
  } catch (error) {
    console.error('Error fetching references:', error)
    return NextResponse.json(
      { error: 'রেফারেন্স লোড করতে সমস্যা হচ্ছে' },
      { status: 500 }
    )
  }
}
