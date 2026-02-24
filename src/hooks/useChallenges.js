import { v4 as uuidv4 } from 'uuid'
import useLocalStorage from './useLocalStorage'
import { sampleChallenges } from '../data/sampleChallenges'

// Index sample challenges by id for fast lookup
const sampleById = Object.fromEntries(sampleChallenges.map(c => [c.id, c]))

// Wrap a fixtureHtml fragment in a full HTML document with a stylesheet link
function wrapFixtureHtml(fragment) {
  // Indent each line of the fragment by 4 spaces (inside <body>)
  const indented = fragment.split('\n').map(line => line ? '    ' + line : line).join('\n')
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>Document</title>
  </head>
  <body>
${indented}
  </body>
</html>
`
}

// Convert a legacy challenge (starterCode/fixtureHtml) to the files array format
function convertToFiles(challenge) {
  const lang = challenge.language || 'javascript'
  const files = []

  if (lang === 'css') {
    files.push({
      name: 'styles.css',
      language: 'css',
      code: challenge.starterCode || '',
      lockedLines: 0,
    })
    if (challenge.fixtureHtml) {
      files.push({
        name: 'index.html',
        language: 'html',
        code: wrapFixtureHtml(challenge.fixtureHtml),
        lockedLines: 0,
      })
    }
  } else if (lang === 'javascript') {
    files.push({
      name: 'app.js',
      language: 'javascript',
      code: challenge.starterCode || '',
      lockedLines: 2,
    })
  } else if (lang === 'html') {
    files.push({
      name: 'index.html',
      language: 'html',
      code: challenge.starterCode || '',
      lockedLines: 0,
    })
  } else if (lang === 'python') {
    files.push({
      name: 'app.py',
      language: 'python',
      code: challenge.starterCode || '',
      lockedLines: 0,
    })
  } else {
    files.push({
      name: 'file.txt',
      language: lang,
      code: challenge.starterCode || '',
      lockedLines: 0,
    })
  }

  return files
}

// Backfill any fields that were added to sample challenges after the initial
// localStorage write (e.g. difficulty, files). User-created challenges are untouched.
function migrate(challenges) {
  return challenges.map(c => {
    const sample = sampleById[c.id]
    const patched = { ...c }

    // Backfill difficulty from samples
    if (sample) {
      if (patched.difficulty == null && sample.difficulty != null) {
        patched.difficulty = sample.difficulty
      }
    }

    // Convert legacy starterCode/fixtureHtml to files array
    if (!patched.files && patched.starterCode != null) {
      patched.files = convertToFiles(patched)
      delete patched.starterCode
      delete patched.fixtureHtml
    }

    // Backfill files from sample data (for sample challenges that already had
    // starterCode converted but sample now has updated files)
    if (sample && sample.files && !patched.files) {
      patched.files = sample.files
    }

    return patched
  })
}

export default function useChallenges() {
  const [challenges, setChallenges] = useLocalStorage('challenges', sampleChallenges)

  // Apply migration on every render (idempotent — only changes stale entries)
  const migratedChallenges = migrate(challenges)

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
    const original = migratedChallenges.find(c => c.id === id)
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

  const getChallengeById = (id) => migratedChallenges.find(c => c.id === id)

  const exportChallenges = () => {
    const json = JSON.stringify(migratedChallenges, null, 2)
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
    challenges: migratedChallenges,
    saveChallenge,
    deleteChallenge,
    duplicateChallenge,
    getChallengeById,
    exportChallenges,
    importChallenges,
  }
}
