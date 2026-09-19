// Reviews section-এর settings shape + default value।
// এই file-টা pure (কোনো prisma import নেই) — তাই client component-এও safely import করা যায়।

export interface ReviewsSettings {
  /** true হলে homepage-এ "লার্নাররা যা বলছেন" সেকশন দেখাবে, false হলে পুরো সেকশন (ফর্মসহ) লুকাবে */
  enabled: boolean
}

export const REVIEWS_SETTINGS_KEY = 'reviews'

/** DB-তে কিছু না থাকলে ডিফল্টভাবে রিভিউ সেকশন চালু থাকবে। */
export const DEFAULT_REVIEWS: ReviewsSettings = {
  enabled: true,
}

/**
 * DB থেকে আসা partial value-কে safe ভাবে ReviewsSettings-এ রূপ দেয়।
 * ভুল/মিসিং হলে default-এ fallback করবে — তাই কখনো crash হবে না।
 */
export function mergeReviews(raw: unknown): ReviewsSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_REVIEWS
  const r = raw as Record<string, unknown>
  return {
    enabled: typeof r.enabled === 'boolean' ? r.enabled : DEFAULT_REVIEWS.enabled,
  }
}
