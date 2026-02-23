export default function TestItem({ test, index, onChange, onDelete, assertionHint }) {
  const update = (field, value) => onChange({ ...test, [field]: value })

  return (
    <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Test {index + 1}
        </span>
        <button
          onClick={onDelete}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 px-2 py-1 rounded"
        >
          Remove
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Description
        </label>
        <input
          type="text"
          value={test.description}
          onChange={e => update('description', e.target.value)}
          placeholder="e.g. add(1, 2) should return 3"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Assertion{' '}
          <span className="font-normal text-gray-400">(must return true/false)</span>
        </label>
        <textarea
          value={test.assertion}
          onChange={e => update('assertion', e.target.value)}
          placeholder={assertionHint || 'return true;'}
          rows={2}
          className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Failure Message
        </label>
        <input
          type="text"
          value={test.failureMessage}
          onChange={e => update('failureMessage', e.target.value)}
          placeholder="e.g. Expected add(1, 2) to return 3"
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}
