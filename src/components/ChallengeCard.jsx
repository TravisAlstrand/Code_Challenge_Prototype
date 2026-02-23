import { Link, useNavigate } from 'react-router-dom'
import { langBadgeClass } from '../utils/langBadge'

export default function ChallengeCard({ challenge, onDelete, onDuplicate }) {
  const navigate = useNavigate()

  const badgeClass = langBadgeClass(challenge.language)

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete "${challenge.title}"? This cannot be undone.`)) {
      onDelete(challenge.id)
    }
  }

  const handleDuplicate = (e) => {
    e.stopPropagation()
    onDuplicate(challenge.id)
  }

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer group"
      onClick={() => navigate(`/challenge/${challenge.id}`)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              {challenge.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass}`}>
                {challenge.language}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {challenge.tests?.length ?? 0} test{challenge.tests?.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 flex-shrink-0">
          <Link
            to={`/admin/${challenge.id}`}
            onClick={e => e.stopPropagation()}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
          >
            Edit
          </Link>
          <button
            onClick={handleDuplicate}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
          >
            Duplicate
          </button>
          <button
            onClick={handleDelete}
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-300 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
