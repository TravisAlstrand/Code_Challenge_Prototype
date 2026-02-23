export default function ConsoleOutput({ results, error, success }) {
  const hasOutput = error || (results && results.length > 0)

  if (!hasOutput) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 select-none">
        <div className="text-5xl mb-3 opacity-30">▶</div>
        <p className="text-sm">Submit your code to see test results</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      {/* Runtime / syntax error before any tests ran */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <span className="text-red-500 text-lg leading-none mt-0.5">✕</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">Runtime Error</p>
            <p className="text-sm font-mono text-red-600 dark:text-red-400 mt-1 break-all">{error}</p>
          </div>
        </div>
      )}

      {/* Individual test results */}
      {results?.map((result, i) => (
        <div
          key={result.id ?? i}
          className={`flex items-start gap-3 rounded-lg p-4 border ${
            result.passed
              ? 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800'
          }`}
        >
          <span className={`text-lg leading-none mt-0.5 ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
            {result.passed ? '✓' : '✕'}
          </span>
          <div className="min-w-0">
            <p className={`text-sm font-medium ${result.passed ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
              {result.description}
            </p>
            {!result.passed && result.message && (
              <p className="text-xs font-mono text-red-600 dark:text-red-400 mt-1 break-all">{result.message}</p>
            )}
          </div>
        </div>
      ))}

      {/* All-pass banner */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mt-2">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">All tests passed!</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Great work — challenge complete.</p>
          </div>
        </div>
      )}
    </div>
  )
}
