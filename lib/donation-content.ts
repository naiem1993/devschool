// Donation section-এর settings shape + default value।
// এই file-টা pure (কোনো prisma import নেই) — তাই client component-এও safely import করা যায়।

export interface DonationSettings {
  /** true হলে donate page-এ donation section (bKash/Nagad/Rocket) দেখাবে, false হলে লুকাবে। */
  enabled: boolean
}

export const DONATION_SETTINGS_KEY = 'donation'

/** DB-তে কিছু না থাকলে ডিফল্টভাবে donation সেকশন চালু থাকবে। */
export const DEFAULT_DONATION: DonationSettings = {
  enabled: true,
}

/**
 * DB থেকে আসা partial value-কে safe ভাবে DonationSettings-এ রূপ দেয়।
 * ভুল/মিসিং হলে default-এ fallback করবে — তাই কখনো crash হবে না।
 */
export function mergeDonation(raw: unknown): DonationSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_DONATION
  const r = raw as Record<string, unknown>
  return {
    enabled: typeof r.enabled === 'boolean' ? r.enabled : DEFAULT_DONATION.enabled,
  }
}
