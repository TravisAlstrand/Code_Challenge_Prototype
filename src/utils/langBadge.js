/**
 * Tailwind classes for language badge chips.
 * Used in ChallengeCard (list page) and StudentChallenge (detail page)
 * so both stay in sync.
 */
export const LANG_BADGES = {
  javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  html:       'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  css:        'bg-sky-100    text-sky-800    dark:bg-sky-900/40    dark:text-sky-300',
  python:     'bg-green-100  text-green-800  dark:bg-green-900/40  dark:text-green-300',
}

export const LANG_BADGE_FALLBACK = 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'

export function langBadgeClass(language) {
  return LANG_BADGES[language?.toLowerCase()] ?? LANG_BADGE_FALLBACK
}

const LANG_DISPLAY_NAMES = {
  javascript: 'JavaScript',
  html:       'HTML',
  css:        'CSS',
  python:     'Python',
}

export function langDisplayName(language) {
  const key = language?.toLowerCase()
  return LANG_DISPLAY_NAMES[key] ?? language
}
