// Shop section-এর settings shape + default value।
// Pure file — client component-এও import safe।

export interface ShopSettings {
  /** true হলে donate page-এ Shop ট্যাব দেখাবে, false হলে লুকাবে। */
  enabled: boolean
}

export const SHOP_SETTINGS_KEY = 'shop'

export const DEFAULT_SHOP: ShopSettings = {
  enabled: true,
}

export function mergeShop(raw: unknown): ShopSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_SHOP
  const r = raw as Record<string, unknown>
  return {
    enabled: typeof r.enabled === 'boolean' ? r.enabled : DEFAULT_SHOP.enabled,
  }
}
