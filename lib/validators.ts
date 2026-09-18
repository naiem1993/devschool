import { z } from 'zod'

// ─── Category Validators ───────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe (lowercase, hyphens)'),
  icon: z.string().trim().max(20).optional().nullable(),
  description: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().default(true),
})

export const updateCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe (lowercase, hyphens)').optional(),
  icon: z.string().trim().max(20).optional().nullable(),
  description: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

// ─── Tutorial Validators ───────────────────────────────────────────────────────

export const createTutorialSchema = z.object({
  title: z.string().min(2).max(255),
  slug: z.string().min(2).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe'),
  categoryId: z.string().cuid({ message: 'Valid categoryId is required' }),
  description: z.string().optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner'),
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  contents: z.array(z.object({
    chapterNo: z.number().int().positive(),
    title: z.string().min(1).max(255),
    content: z.string().min(1),
    codeExample: z.string().optional(),
  })).optional(),
})

export const updateTutorialSchema = z.object({
  title: z.string().min(2).max(255).optional(),
  slug: z.string().min(2).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe').optional(),
  categoryId: z.string().cuid().optional(),
  description: z.string().optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  isActive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
})

// ─── Quiz Question Validators ──────────────────────────────────────────────────

export const createQuizQuestionSchema = z.object({
  tutorialId: z.string().cuid({ message: 'Valid tutorialId is required' }),
  question: z.string().min(5).max(500),
  explanation: z.string().optional(),
  orderIndex: z.number().int().nonnegative().default(0),
})

export const createQuizOptionSchema = z.object({
  questionId: z.string().cuid({ message: 'Valid questionId is required' }),
  text: z.string().min(1).max(255),
  isCorrect: z.boolean().default(false),
})

// ─── Reference Validators ──────────────────────────────────────────────────────

export const createReferenceSchema = z.object({
  categoryId: z.string().cuid({ message: 'Valid categoryId is required' }),
  title: z.string().min(2).max(255),
  slug: z.string().min(2).max(255),
  description: z.string().optional(),
  syntax: z.string().optional(),
  example: z.string().optional(),
  tags: z.array(z.string()).default([]),
})

export const updateReferenceSchema = z.object({
  title: z.string().min(2).max(255).optional(),
  slug: z.string().min(2).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe').optional(),
  description: z.string().optional(),
  syntax: z.string().optional(),
  example: z.string().optional(),
  tags: z.array(z.string()).optional(),
  language: z.string().trim().max(50).optional().nullable(),
})

// ─── Code Challenge Validators ─────────────────────────────────────────────────

export const createChallengeSchema = z.object({
  tutorialId: z.string().cuid({ message: 'Valid tutorialId is required' }),
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  starterCode: z.string().optional(),
  solution: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Easy'),
})

export const createTestCaseSchema = z.object({
  challengeId: z.string().cuid({ message: 'Valid challengeId is required' }),
  input: z.string().min(1),
  expectedOutput: z.string().min(1),
  isHidden: z.boolean().default(false),
})

// ─── Donation Validators ───────────────────────────────────────────────────────

export const createDonationSchema = z.object({
  donorName: z.string().min(1).max(150),
  amount: z.number().positive({ message: 'Amount must be positive' }),
  currency: z.string().length(3).default('BDT'),
  message: z.string().max(500).optional(),
  isPublic: z.boolean().default(false),
})

// ─── Query Parameter Validators ────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  sort: z.enum(['createdAt', 'title', 'viewCount', 'updatedAt']).default('createdAt').optional(),
  order: z.enum(['asc', 'desc']).default('desc').optional(),
})

export const searchSchema = z.object({
  q: z.string().min(2).max(100).optional(),
  category: z.string().optional(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  ...paginationSchema.shape,
})

export const slugParamSchema = z.object({
  slug: z.string().min(1),
})

export const idParamSchema = z.object({
  id: z.string().cuid({ message: 'Valid ID format required' }),
})

// ─── Helper Functions ──────────────────────────────────────────────────────────

/**
 * Validate request body with Zod schema
 * @returns {data, error} - Returns validated data or error object
 */
export function validateBody<T>(schema: z.ZodType<T>, body: unknown): { data: T | null; error: string | null } {
  const result = schema.safeParse(body)
  if (result.success) {
    return { data: result.data, error: null }
  }
  return { data: null, error: result.error.issues.map((e: any) => e.message).join(', ') }
}

/**
 * Validate request query params with Zod schema
 * @returns {data, error} - Returns validated params or error object
 */
export function validateQuery<T>(schema: z.ZodType<T>, query: Record<string, string | undefined>): { data: T | null; error: string | null } {
  const result = schema.safeParse(query)
  if (result.success) {
    return { data: result.data, error: null }
  }
  return { data: null, error: result.error.issues.map((e: any) => e.message).join(', ') }
}

/**
 * Get pagination metadata for API responses
 */
export function getPaginationMetadata(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }
}

// ─── Sponsor Validators ─────────────────────────────────────────────────────────

export const SPONSOR_TIERS = ['gold', 'silver', 'bronze', 'partner'] as const

const urlOrPath = z
  .string()
  .trim()
  .refine(
    (v) => v === '' || v.startsWith('/') || /^https?:\/\//i.test(v),
    'Must be an http(s) URL or an internal path'
  )

export const createSponsorSchema = z.object({
  name: z.string().min(1).max(150),
  logoUrl: urlOrPath.optional(),
  imageId: z.string().cuid().nullable().optional(),
  websiteUrl: z.string().trim().url('Must be a valid URL').max(500).optional().or(z.literal('')),
  description: z.string().max(500).optional(),
  tier: z.enum(SPONSOR_TIERS).default('partner'),
  priority: z.number().int().min(0).max(999).default(0),
  isActive: z.boolean().default(true),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
})

export const updateSponsorSchema = createSponsorSchema.partial()

export const trackClickSchema = z.object({
  sponsorId: z.string().cuid(),
})
