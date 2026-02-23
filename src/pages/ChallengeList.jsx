import { useRef } from 'react'
import { Link } from 'react-router-dom'
import useChallenges from '../hooks/useChallenges'
import ChallengeCard from '../components/ChallengeCard'

export default function ChallengeList() {
  const { challenges, deleteChallenge, duplicateChallenge, exportChallenges, importChallenges } = useChallenges()
  const fileInputRef = useRef()

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const count = await importChallenges(file)
      alert(`Imported ${count} challenge(s) successfully.`)
    } catch {
      alert('Import failed: invalid JSON format.')
    }
    e.target.value = ''
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Challenges</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {challenges.length} challenge{challenges.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportChallenges}
            disabled={challenges.length === 0}
            className="text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Export JSON
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Link
            to="/admin"
            className="text-sm px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm"
          >
            + Create Challenge
          </Link>
        </div>
      </div>

      {/* Empty state */}
      {challenges.length === 0 ? (
        <div className="text-center py-28">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No challenges yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Create your first coding challenge to get started.</p>
          <Link
            to="/admin"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm"
          >
            Create Challenge
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {challenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onDelete={deleteChallenge}
              onDuplicate={duplicateChallenge}
            />
          ))}
        </div>
      )}
    </div>
  )
}
