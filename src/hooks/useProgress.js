import useLocalStorage from './useLocalStorage'

const STORAGE_KEY = 'treehouse-progress'

export default function useProgress() {
  const [completed, setCompleted] = useLocalStorage(STORAGE_KEY, [])

  const completedSet = new Set(completed)

  const markComplete = (id) => {
    if (!completedSet.has(id)) {
      setCompleted([...completed, id])
    }
  }

  const isComplete = (id) => completedSet.has(id)

  const resetComplete = (id) => {
    setCompleted(completed.filter(completedId => completedId !== id))
  }

  return { isComplete, markComplete, resetComplete, completedCount: completed.length }
}
