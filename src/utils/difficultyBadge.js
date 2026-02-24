export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

const DIFFICULTY_CONFIG = {
  beginner: {
    label: 'Beginner',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    filterActiveClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-transparent',
  },
  intermediate: {
    label: 'Intermediate',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    filterActiveClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-transparent',
  },
  advanced: {
    label: 'Advanced',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    filterActiveClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-transparent',
  },
}

export function difficultyBadgeClass(difficulty) {
  return DIFFICULTY_CONFIG[difficulty?.toLowerCase()]?.badgeClass
    ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
}

export function difficultyFilterActiveClass(difficulty) {
  return DIFFICULTY_CONFIG[difficulty?.toLowerCase()]?.filterActiveClass
    ?? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
}

export function difficultyLabel(difficulty) {
  return DIFFICULTY_CONFIG[difficulty?.toLowerCase()]?.label ?? difficulty
}
