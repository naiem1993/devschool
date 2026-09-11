/**
 * Anonymous device identifier.
 *
 * Stores a stable random ID in localStorage so we can track
 * quiz/challenge progress without requiring a login.
 *
 * NOTE: this is best-effort only. Clearing browser data resets progress.
 * When real auth is added, migrate these deviceIds → userIds.
 */

const KEY = 'devschool:deviceId'

export function getDeviceId(): string {
  if (typeof window === 'undefined') return ''
  try {
    let id = localStorage.getItem(KEY)
    if (!id) {
      id = `dev_${crypto.randomUUID().replace(/-/g, '').slice(0, 20)}`
      localStorage.setItem(KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

export function getDeviceHeaders(): Record<string, string> {
  const id = getDeviceId()
  return id ? { 'x-device-id': id } : {}
}
