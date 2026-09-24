import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/search
 *
 * Query params:
 *   q          — search term (min 2 chars)
 *   type       — 'all' | 'tutorials' | 'references'  (default: all)
 *   difficulty — tutorial difficulty filter (optional)
 *   language   — reference language filter (optional)
 *   limit      — results per page (1..30, default 12)
 *   offset     — pagination offset (default 0)
 *
 * Uses PostgreSQL Full-Text Search via websearch_to_tsquery('simple', q).
 * The 'simple' configuration is language-agnostic so it works for both
 * Bangla and English without stemming noise.
 *
 * Returns:
 *   { query, type, tutorials: [...], references: [...],
 *     total, tookMs, fallback? }
 */
export async function GET(request: NextRequest) {
  const started = Date.now()
  const url = new URL(request.url)

  const q = (url.searchParams.get('q') || '').trim()
  const type = (url.searchParams.get('type') || 'all').toLowerCase()
  const difficulty = (url.searchParams.get('difficulty') || '').trim()
  const language = (url.searchParams.get('language') || '').trim()
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 12), 1), 30)
  const offset = Math.max(Number(url.searchParams.get('offset') || 0), 0)

  const emptyBody = {
    query: q,
    type,
    tutorials: [] as unknown[],
    references: [] as unknown[],
    total: 0,
    tookMs: 0,
  }

  if (q.length < 2) {
    return NextResponse.json(emptyBody)
  }

  const wantTutorials = type === 'all' || type === 'tutorials'
  const wantReferences = type === 'all' || type === 'references'

  try {
    let tutorialRows: unknown[] = []
    let referenceRows: unknown[] = []

    if (wantTutorials) {
      tutorialRows = await prisma.$queryRaw<
        Array<{
          id: string
          title: string
          slug: string
          description: string | null
          difficulty: string
          rank: number
        }>
      >`
        SELECT
          t.id,
          t.title,
          t.slug,
          t.description,
          t.difficulty,
          ts_rank(t."searchVec", websearch_to_tsquery('simple', ${q})) AS rank
        FROM "Tutorial" t
        WHERE t."isPublished" = true
          AND t."searchVec" @@ websearch_to_tsquery('simple', ${q})
          AND (${difficulty} = '' OR t.difficulty = ${difficulty})
        ORDER BY rank DESC, t."viewCount" DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    if (wantReferences) {
      referenceRows = await prisma.$queryRaw<
        Array<{
          id: string
          title: string
          slug: string
          syntax: string | null
          language: string | null
          rank: number
        }>
      >`
        SELECT
          r.id,
          r.title,
          r.slug,
          r.syntax,
          r.language,
          ts_rank(r."searchVec", websearch_to_tsquery('simple', ${q})) AS rank
        FROM "Reference" r
        WHERE r."searchVec" @@ websearch_to_tsquery('simple', ${q})
          AND (${language} = '' OR r.language = ${language})
        ORDER BY rank DESC, r.title ASC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    return NextResponse.json({
      query: q,
      type,
      tutorials: tutorialRows,
      references: referenceRows,
      total: tutorialRows.length + referenceRows.length,
      tookMs: Date.now() - started,
    })
  } catch (err: any) {
    console.error('[api/search] error:', err)
    // If FTS column/index missing, fall back to ILIKE (tutorials only)
    if (err?.code === '42703' || String(err?.message || '').includes('searchVec')) {
      const tutorials = wantTutorials
        ? await prisma.tutorial.findMany({
            where: {
              isPublished: true,
              AND: [
                {
                  OR: [
                    { titleBn: { contains: q, mode: 'insensitive' } },
                    { descriptionBn: { contains: q, mode: 'insensitive' } },
                  ],
                },
                difficulty ? { difficulty } : {},
              ],
            },
            select: {
              id: true,
              titleBn: true,
              slug: true,
              descriptionBn: true,
              difficulty: true,
            },
            take: limit,
            skip: offset,
            orderBy: { viewCount: 'desc' },
          })
        : []

      return NextResponse.json({
        query: q,
        type,
        tutorials: tutorials.map((t) => ({
          ...t,
          rank: 0,
        })),
        references: [],
        total: tutorials.length,
        tookMs: Date.now() - started,
        fallback: true,
      })
    }
    return NextResponse.json({ error: 'search failed' }, { status: 500 })
  }
}
