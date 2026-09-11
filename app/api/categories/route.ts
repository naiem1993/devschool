import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { paginationSchema, validateQuery } from '@/lib/validators'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

/**
 * GET /api/categories
 * Fetches categories directly from Prisma with optimized query
 * 
 * Example with pagination:
 *   GET /api/categories?page=1&limit=10&sort=createdAt&order=desc
 */
export async function GET(request?: NextRequest) {
  // If called from frontend route handler, validate query params
  if (request) {
    const searchParams = request.nextUrl.searchParams
    const query = Object.fromEntries(searchParams.entries())
    
    const validated = validateQuery(paginationSchema, query)
    if (validated.error) {
      return NextResponse.json(
        { error: 'ইনপুট ভ্যালিডেশন ব্যর্থ', details: validated.error },
        { status: 400 }
      )
    }
  }
  
  try {
    // ─── Query optimization: Select only needed fields ───────────────────────
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        // ─── Count related tutorials without loading them ────────────────────
        _count: {
          select: { tutorials: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
      // ─── Filter only active categories ─────────────────────────────────────
      where: { isActive: true },
    })
    
    return NextResponse.json({
      categories,
      total: categories.length,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'ক্যাটাগরি লোড করতে সমস্যা হচ্ছে' },
      { status: 500 }
    )
  }
}
