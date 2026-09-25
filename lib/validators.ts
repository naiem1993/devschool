import { z } from 'zod'

// ─── Tutorial Validators ───────────────────────────────────────────────────────

export const createTutorialSchema = z.object({
  titleBn: z.string().min(2).max(255),
  titleEn: z.string().min(2).max(255).optional(),
  slug: z.string().min(2).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe'),
  descriptionBn: z.string().optional(),
  descriptionEn: z.string().optional(),
  /** কার্ডে দেখানোর জন্য emoji/short icon (যেমন 🌐, 🎨, 🟨) — ঐচ্ছিক */
  icon: z.string().trim().max(20).optional().nullable(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner'),
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  /** @deprecated nested structure (v3) — chapter/lesson আলাদা API থেকে তৈরি হয় */
  contents: z.array(z.any()).optional(),
})

export const updateTutorialSchema = z.object({
  titleBn: z.string().min(2).max(255).optional(),
  titleEn: z.string().min(2).max(255).optional(),
  slug: z.string().min(2).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe').optional(),
  descriptionBn: z.string().optional(),
  descriptionEn: z.string().optional(),
  /** কার্ডে দেখানোর জন্য emoji/short icon (যেমন 🌐, 🎨, 🟨) — ঐচ্ছিক */
  icon: z.string().trim().max(20).optional().nullable(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  isActive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
})

// ─── Nested Structure Validators (v3) ──────────────────────────────────────────

const urlSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const createGroupSchema = z.object({
  title: z.string().min(1).max(255),
  titleEn: z.string().min(1).max(255).optional(),
  sortOrder: z.number().int().optional(),
})

export const updateGroupSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  titleEn: z.string().min(1).max(255).optional(),
  sortOrder: z.number().int().optional(),
})

export const createChapterSchema = z.object({
  title: z.string().min(1).max(255),
  titleEn: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(urlSlug, 'Slug must be URL-safe (lowercase, hyphens)'),
  groupId: z.string().cuid().nullable().optional(),
  content: z.string().nullable().optional(),
  contentEn: z.string().nullable().optional(),
  codeExample: z.string().nullable().optional(),
  codeExampleEn: z.string().nullable().optional(),
})

export const updateChapterSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  titleEn: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(urlSlug, 'Slug must be URL-safe (lowercase, hyphens)').optional(),
  groupId: z.string().cuid().nullable().optional(),
  content: z.string().nullable().optional(),
  contentEn: z.string().nullable().optional(),
  codeExample: z.string().nullable().optional(),
  codeExampleEn: z.string().nullable().optional(),
})

export const createLessonSchema = z.object({
  title: z.string().min(1).max(255),
  titleEn: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(urlSlug, 'Slug must be URL-safe (lowercase, hyphens)'),
  content: z.string().min(1),
  contentEn: z.string().nullable().optional(),
  codeExample: z.string().nullable().optional(),
  codeExampleEn: z.string().nullable().optional(),
})

export const updateLessonSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  titleEn: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(urlSlug, 'Slug must be URL-safe (lowercase, hyphens)').optional(),
  content: z.string().min(1).optional(),
  contentEn: z.string().nullable().optional(),
  codeExample: z.string().nullable().optional(),
  codeExampleEn: z.string().nullable().optional(),
})

// ─── Quiz Question Validators ──────────────────────────────────────────────────

export const createQuizQuestionSchema = z.object({
  tutorialId: z.string().cuid({ message: 'Valid tutorialId is required' }),
  questionBn: z.string().min(5).max(500),
  questionEn: z.string().min(5).max(500).optional(),
  explanationBn: z.string().optional(),
  explanationEn: z.string().optional(),
  orderIndex: z.number().int().nonnegative().default(0),
})

export const createQuizOptionSchema = z.object({
  questionId: z.string().cuid({ message: 'Valid questionId is required' }),
  textBn: z.string().min(1).max(255),
  textEn: z.string().min(1).max(255).optional(),
  isCorrect: z.boolean().default(false),
})

// ─── Reference Validators ──────────────────────────────────────────────────────

export const createReferenceSchema = z.object({
  tutorialId: z.string().cuid({ message: 'Valid tutorialId is required' }),
  titleBn: z.string().min(2).max(255),
  titleEn: z.string().min(2).max(255),
  slug: z.string().min(2).max(255),
  descriptionBn: z.string().optional(),
  descriptionEn: z.string().optional(),
  syntaxBn: z.string().optional(),
  syntaxEn: z.string().optional(),
  exampleBn: z.string().optional(),
  exampleEn: z.string().optional(),
  language: z.string().trim().max(50).optional().nullable(),
  tags: z.array(z.string()).default([]),
})

export const updateReferenceSchema = z.object({
  titleBn: z.string().min(2).max(255).optional(),
  titleEn: z.string().min(2).max(255).optional(),
  slug: z.string().min(2).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe').optional(),
  descriptionBn: z.string().optional(),
  descriptionEn: z.string().optional(),
  syntaxBn: z.string().optional(),
  syntaxEn: z.string().optional(),
  exampleBn: z.string().optional(),
  exampleEn: z.string().optional(),
  tags: z.array(z.string()).optional(),
  language: z.string().trim().max(50).optional().nullable(),
})

// ─── Code Challenge Validators ─────────────────────────────────────────────────

export const createChallengeSchema = z.object({
  tutorialId: z.string().cuid({ message: 'Valid tutorialId is required' }),
  titleBn: z.string().min(2).max(255),
  titleEn: z.string().min(2).max(255).optional(),
  descriptionBn: z.string().optional(),
  descriptionEn: z.string().optional(),
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

// ─── Review Validators ─────────────────────────────────────────────────────────

/** Public review submit — honeypot ফিল্ড `website` খালি থাকতে হবে (bot trap) */
export const createReviewSchema = z.object({
  name: z.string().trim().min(2).max(80),
  role: z.string().trim().max(80).optional().nullable(),
  stars: z.number().int().min(1).max(5).default(5),
  text: z.string().trim().min(5).max(600),
  website: z.string().max(0, 'spam detected').optional().nullable(),
})

/** Admin moderation — approve / unapprove */
export const reviewModerationSchema = z.object({
  status: z.enum(['pending', 'approved']),
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
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  ...paginationSchema.shape,
})

export const slugParamSchema = z.object({
  slug: z.string().min(1),
})

export const idParamSchema = z.object({
  id: z.string().cuid({ message: 'Valid ID format required' }),
})

// ─── Site Settings Validators ─────────────────────────────────────────────────

/** Hero section content — SiteSettings key='hero' */
export const heroSettingsSchema = z.object({
  badge: z.string().min(1).max(200),
  heading: z.string().min(1).max(200),
  headingHighlight: z.string().min(1).max(200),
  subtitle: z.string().min(1).max(600),
  searchPlaceholder: z.string().min(1).max(200),
  cta1Label: z.string().min(1).max(100),
  cta1Href: z.string().min(1).max(200),
  cta2Label: z.string().min(1).max(100),
  cta2Href: z.string().min(1).max(200),
  statLabels: z.array(z.string().min(1).max(100)).length(4),
})

/** Footer content — SiteSettings key='footer' */
export const footerSettingsSchema = z.object({
  copyright: z.string().min(1).max(300),
  /** Social icon list — empty array দিলে icon block hide হবে */
  socialLinks: z
    .array(
      z.object({
        platform: z.enum([
          'github',
          'twitter',
          'x',
          'youtube',
          'discord',
          'linkedin',
          'facebook',
          'instagram',
          'tiktok',
          'telegram',
        ]),
        url: z.string().url().max(500),
      }),
    )
    .max(12)
    .optional(),
  /** "Made with 💚 {creditText}" — empty হলে শুধু heart দেখাবে */
  creditText: z.string().max(80).optional(),
  donatePrompt: z.string().min(1).max(200),
  donateLinkLabel: z.string().min(1).max(100),
  donateLinkHref: z.string().min(1).max(200),
})

// ─── Helper Functions ──────────────────────────────────────────────────────────

/**
 * Validate request body with Zod schema
 * @returns {data, error} - Returns validated data or error object
 */
/** Reviews section toggle — SiteSettings key='reviews' */
export const reviewsSettingsSchema = z.object({
  enabled: z.boolean(),
})

/** FAQ section content — SiteSettings key='faq' (PART 9j — bn+en paired) */
export const faqSettingsSchema = z.object({
  items: z
    .array(
      z.object({
        // বাংলা required
        q: z.string().trim().min(1).max(300),
        a: z.string().trim().min(1).max(2000),
        // ইংরেজি — admin form required, তবু schema-তে optional (পুরনো data tolerate করার জন্য)
        qEn: z.string().trim().max(300).optional().nullable(),
        aEn: z.string().trim().max(2000).optional().nullable(),
      }),
    )
    .max(50),
})

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
