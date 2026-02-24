import { useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useChallenges from '../hooks/useChallenges'
import useProgress from '../hooks/useProgress'
import ChallengeCard from '../components/ChallengeCard'
import { langBadgeClass, langDisplayName } from '../utils/langBadge'

export default function ChallengeList() {
  const { challenges, deleteChallenge, duplicateChallenge, exportChallenges, importChallenges } = useChallenges()
  const { isComplete, resetComplete, completedCount } = useProgress()
  const fileInputRef = useRef()
  const [activeFilter, setActiveFilter] = useState('all')

  // Derive unique languages from the current challenge list, alphabetically
  const languages = useMemo(() => {
    const unique = [...new Set(challenges.map(c => c.language?.toLowerCase()).filter(Boolean))]
    return unique.sort()
  }, [challenges])

  // Sort by language then by title within each language; apply active filter
  const visibleChallenges = useMemo(() => {
    const filtered = activeFilter === 'all'
      ? challenges
      : challenges.filter(c => c.language?.toLowerCase() === activeFilter)
    return [...filtered].sort((a, b) => {
      const lang = (a.language ?? '').localeCompare(b.language ?? '')
      return lang !== 0 ? lang : (a.title ?? '').localeCompare(b.title ?? '')
    })
  }, [challenges, activeFilter])

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
            {visibleChallenges.length} challenge{visibleChallenges.length !== 1 ? 's' : ''}{activeFilter !== 'all' ? ` in ${activeFilter}` : ' available'}
            {completedCount > 0 && (
              <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                · {completedCount} completed
              </span>
            )}
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

      {/* Filter bar — only shown when there are multiple languages */}
      {languages.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={`text-sm px-3 py-1.5 rounded-full font-medium border transition-colors ${
              activeFilter === 'all'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            All
          </button>
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setActiveFilter(lang)}
              className={`text-sm px-3 py-1.5 rounded-full font-medium border transition-colors ${
                activeFilter === lang
                  ? `${langBadgeClass(lang)} border-transparent`
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {langDisplayName(lang)}
            </button>
          ))}
        </div>
      )}

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
      ) : visibleChallenges.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No {activeFilter} challenges yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {visibleChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onDelete={deleteChallenge}
              onDuplicate={duplicateChallenge}
              onReset={resetComplete}
              isCompleted={isComplete(challenge.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
