import { v4 as uuidv4 } from 'uuid'
import useLocalStorage from './useLocalStorage'
import { sampleChallenges } from '../data/sampleChallenges'

export default function useChallenges() {
  const [challenges, setChallenges] = useLocalStorage('challenges', sampleChallenges)

  /**
   * Save (create or update) a challenge.
   * Returns the saved challenge (with id populated for new ones).
   */
  const saveChallenge = (challenge) => {
    if (challenge.id) {
      setChallenges(prev => prev.map(c => c.id === challenge.id ? challenge : c))
      return challenge
    } else {
      const created = { ...challenge, id: uuidv4() }
      setChallenges(prev => [...prev, created])
      return created
    }
  }

  const deleteChallenge = (id) => {
    setChallenges(prev => prev.filter(c => c.id !== id))
  }

  const duplicateChallenge = (id) => {
    const original = challenges.find(c => c.id === id)
    if (!original) return
    const copy = {
      ...original,
      id: uuidv4(),
      title: `${original.title} (Copy)`,
      tests: original.tests.map(t => ({ ...t, id: uuidv4() })),
    }
    setChallenges(prev => [...prev, copy])
    return copy
  }

  const getChallengeById = (id) => challenges.find(c => c.id === id)

  const exportChallenges = () => {
    const json = JSON.stringify(challenges, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'challenges.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importChallenges = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result)
          if (!Array.isArray(imported)) throw new Error('Expected an array of challenges')
          setChallenges(prev => {
            const existingIds = new Set(prev.map(c => c.id))
            const newOnes = imported.filter(c => !existingIds.has(c.id))
            return [...prev, ...newOnes]
          })
          resolve(imported.length)
        } catch (err) {
          reject(err)
        }
      }
      reader.onerror = () => reject(new Error('File read failed'))
      reader.readAsText(file)
    })
  }

  return {
    challenges,
    saveChallenge,
    deleteChallenge,
    duplicateChallenge,
    getChallengeById,
    exportChallenges,
    importChallenges,
  }
}
