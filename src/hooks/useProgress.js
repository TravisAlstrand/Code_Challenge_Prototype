import useLocalStorage from './useLocalStorage'

const STORAGE_KEY = 'treehouse-progress'
const STEP_STORAGE_KEY = 'treehouse-step-progress'

export default function useProgress() {
  const [completed, setCompleted] = useLocalStorage(STORAGE_KEY, [])
  const [stepProgress, setStepProgress] = useLocalStorage(STEP_STORAGE_KEY, {})

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

  // ─── Multi-step progress ───────────────────────────────────────────

  const getStepProgress = (challengeId) => stepProgress[challengeId] || null

  const completeStep = (challengeId, stepIndex, totalSteps) => {
    setStepProgress(prev => {
      const existing = prev[challengeId] || { currentStep: 0, completedSteps: [] }
      const completedSteps = existing.completedSteps.includes(stepIndex)
        ? existing.completedSteps
        : [...existing.completedSteps, stepIndex]
      const currentStep = stepIndex + 1 < totalSteps ? stepIndex + 1 : stepIndex
      return { ...prev, [challengeId]: { currentStep, completedSteps } }
    })

    // Mark overall challenge complete when last step is done
    if (stepIndex + 1 >= totalSteps) {
      markComplete(challengeId)
    }
  }

  const resetStepProgress = (challengeId) => {
    setStepProgress(prev => {
      const updated = { ...prev }
      delete updated[challengeId]
      return updated
    })
    resetComplete(challengeId)
  }

  return {
    isComplete,
    markComplete,
    resetComplete,
    completedCount: completed.length,
    getStepProgress,
    completeStep,
    resetStepProgress,
  }
}
