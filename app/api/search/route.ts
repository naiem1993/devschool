import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * FTS column presence cache.
 *
 * The `searchVec` column was dropped from Tutorial/Reference in migration
 * 20260918151014 — but FTS is still the intended long-term search backend.
 * We probe once (cheap) and cache the answer so we don't spam the server
 * log with `column does not exist` errors on every request. If a future
 * migration restores `searchVec`, the next cold start uses FTS again.
 *
 *   null  → not yet probed
 *   false → known missing (use ILIKE fallback directly)
 *   true  → known present (use FTS)
 */
let hasFtsColumn: boolean | null = null

async function probeFtsColumn(): Promise<boolean> {
  if (hasFtsColumn !== null) return hasFtsColumn
  try {
    const rows = await prisma.$queryRaw<Array<{ n: bigint | number }>>`
      SELECT COUNT(*)::int AS n
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'Tutorial'
        AND column_name = 'searchVec'
    `
    hasFtsColumn = Number(rows[0]?.n ?? 0) > 0
  } catch {
    // DB unreachable — do not cache; let the normal error path handle it.
    return false
  }
  return hasFtsColumn
}

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
  const isEn = (url.searchParams.get('locale') || 'bn') === 'en'
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

  // FTS is intentionally DISABLED until a DB migration restores the
  // `searchVec` column on Tutorial/Reference. Until then probeFtsColumn()
  // returns false and every request uses the ILIKE fallback below — which is
  // correct but slower at scale. The FTS query code further down is kept so
  // that restoring the column re-enables it automatically (no code change).
  const useFts = await probeFtsColumn()

  /** ILIKE-based fallback used when the FTS column/index is missing. */
  async function runFallback(): Promise<NextResponse> {
    const tutorials = wantTutorials
      ? await prisma.tutorial.findMany({
          where: {
            isPublished: true,
            AND: [
              {
                OR: isEn
                  ? [
                      { titleBn: { contains: q, mode: 'insensitive' } },
                      { titleEn: { contains: q, mode: 'insensitive' } },
                      { descriptionBn: { contains: q, mode: 'insensitive' } },
                      { descriptionEn: { contains: q, mode: 'insensitive' } },
                    ]
                  : [
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
            titleEn: true,
            slug: true,
            descriptionBn: true,
            descriptionEn: true,
            difficulty: true,
          },
          take: limit,
          skip: offset,
          orderBy: { viewCount: 'desc' },
        })
      : []

    const references = wantReferences
      ? await prisma.reference.findMany({
          where: {
            OR: isEn
              ? [
                  { titleBn: { contains: q, mode: 'insensitive' } },
                  { titleEn: { contains: q, mode: 'insensitive' } },
                  { syntaxBn: { contains: q, mode: 'insensitive' } },
                  { syntaxEn: { contains: q, mode: 'insensitive' } },
                ]
              : [
                  { titleBn: { contains: q, mode: 'insensitive' } },
                  { syntaxBn: { contains: q, mode: 'insensitive' } },
                ],
            ...(language ? { language } : {}),
          },
          select: {
            id: true,
            titleBn: true,
            titleEn: true,
            slug: true,
            syntaxBn: true,
            syntaxEn: true,
            language: true,
          },
          take: limit,
          skip: offset,
        })
      : []

    const pick = (
      bn: string | null | undefined,
      en: string | null | undefined,
      useEn: boolean
    ): string => (useEn ? (en ?? bn) : (bn ?? en)) ?? ''

    return NextResponse.json({
      query: q,
      type,
      tutorials: tutorials.map((t) => ({
        id: t.id,
        title: pick(t.titleBn, t.titleEn, isEn),
        slug: t.slug,
        description: isEn
          ? (t.descriptionEn ?? t.descriptionBn ?? null)
          : (t.descriptionBn ?? t.descriptionEn ?? null),
        difficulty: t.difficulty,
        categoryName: null,
        rank: 0,
      })),
      references: references.map((r) => ({
        id: r.id,
        title: pick(r.titleBn, r.titleEn, isEn),
        slug: r.slug,
        syntax: isEn ? (r.syntaxEn ?? r.syntaxBn ?? null) : (r.syntaxBn ?? r.syntaxEn ?? null),
        language: r.language,
        categoryName: null,
        rank: 0,
      })),
      total: tutorials.length + references.length,
      tookMs: Date.now() - started,
      fallback: true,
    })
  }

  if (!useFts) {
    return runFallback()
  }

  try {
    let tutorialRows: unknown[] = []
    let referenceRows: unknown[] = []

    if (useFts && wantTutorials) {
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

    if (useFts && wantReferences) {
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
  } catch (err: unknown) {
    // If the probe said FTS existed but the query still failed (schema drift,
    // dropped column, missing index), mark it absent and retry via fallback.
    const errCode = err && typeof err === 'object' && 'code' in err ? (err as { code: unknown }).code : undefined
    const errMsg = err instanceof Error ? err.message : String(err)
    if (errCode === '42703' || errMsg.includes('searchVec')) {
      hasFtsColumn = false
      return runFallback()
    }
    console.error('[api/search] error:', err)
    return NextResponse.json({ error: 'search failed' }, { status: 500 })
  }
}
