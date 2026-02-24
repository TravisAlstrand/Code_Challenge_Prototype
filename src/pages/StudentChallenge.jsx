import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import useChallenges from '../hooks/useChallenges'
import useDebounce from '../hooks/useDebounce'
import CodeEditor from '../components/CodeEditor'
import MarkdownRenderer from '../components/MarkdownRenderer'
import ConsoleOutput from '../components/ConsoleOutput'
import PreviewFrame from '../components/PreviewFrame'
import { executeChallenge } from '../engine/executor'
import { prewarmPython, isPythonReady } from '../engine/pythonRuntime'
import { langBadgeClass, langDisplayName } from '../utils/langBadge'
import useProgress from '../hooks/useProgress'

// Languages that get a Preview tab
const PREVIEWABLE = ['javascript', 'html', 'css']

const TABS = ['code', 'preview', 'results']

export default function StudentChallenge() {
  const { id } = useParams()
  const { getChallengeById } = useChallenges()

  const [challenge, setChallenge] = useState(null)
  const [files, setFiles] = useState({})          // { [filename]: codeString }
  const [activeFile, setActiveFile] = useState('') // currently selected file tab
  const [activeTab, setActiveTab] = useState('code')
  const [result, setResult] = useState(null)
  const [running, setRunning] = useState(false)
  const [pythonReady, setPythonReady] = useState(false)
  const { markComplete } = useProgress()

  // Debounced files map for preview rendering
  const debouncedFiles = useDebounce(files, 650)
  const isPreviewStale = useMemo(
    () => JSON.stringify(files) !== JSON.stringify(debouncedFiles),
    [files, debouncedFiles]
  )

  useEffect(() => {
    const c = getChallengeById(id)
    if (c) {
      setChallenge(c)
      // Build files map from challenge.files array
      const fileMap = {}
      c.files?.forEach(f => { fileMap[f.name] = f.code })
      setFiles(fileMap)
      setActiveFile(c.files?.[0]?.name || '')
    }
  }, [id])

  // Pre-warm Pyodide as soon as a Python challenge is opened so the
  // ~8 MB download starts in the background rather than at submit time.
  useEffect(() => {
    if (challenge?.language?.toLowerCase() === 'python') {
      if (isPythonReady()) {
        setPythonReady(true)
      } else {
        prewarmPython()
          .then(() => setPythonReady(true))
          .catch(() => setPythonReady(false))
      }
    }
  }, [challenge])

  if (!challenge) {
    return (
      <div className="text-center py-28">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Challenge not found</h2>
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
          ← Back to challenges
        </Link>
      </div>
    )
  }

  const hasPreview = PREVIEWABLE.includes(challenge.language?.toLowerCase())
  const isPython = challenge.language?.toLowerCase() === 'python'

  const visibleTabs = hasPreview ? TABS : TABS.filter(t => t !== 'preview')

  const submitDisabled = running || (isPython && !pythonReady)
  const submitLabel = running
    ? 'Running…'
    : (isPython && !pythonReady)
    ? 'Loading Python…'
    : 'Submit'

  const handleSubmit = async () => {
    setRunning(true)
    setActiveTab('results')
    const output = await executeChallenge(challenge.language, files, challenge.tests)
    setResult(output)
    if (output.success) markComplete(challenge.id)
    setRunning(false)
  }

  const handleReset = () => {
    if (window.confirm('Reset your code back to the starter code?')) {
      const fileMap = {}
      challenge.files?.forEach(f => { fileMap[f.name] = f.code })
      setFiles(fileMap)
      setActiveFile(challenge.files?.[0]?.name || '')
      setResult(null)
    }
  }

  return (
    <div className="flex flex-col -mt-8 -mx-4 sm:-mx-6 lg:-mx-8" style={{ height: 'calc(100vh - 4rem)' }}>

      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200">Challenges</Link>
          <span>/</span>
          <span className="text-gray-800 dark:text-gray-200 font-medium truncate">{challenge.title}</span>
        </div>
      </div>

      {/* ── Main split ─────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: description */}
        <aside className="w-2/5 min-w-[280px] max-w-[520px] flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                  {challenge.title}
                </h1>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${langBadgeClass(challenge.language)}`}>
                  {langDisplayName(challenge.language)}
                </span>
              </div>
            </div>

            <MarkdownRenderer content={challenge.description} />

            {challenge.tests.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  {challenge.tests.length} Test{challenge.tests.length !== 1 ? 's' : ''}
                </h3>
                <ol className="space-y-1.5">
                  {challenge.tests.map((test, i) => (
                    <li key={test.id} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5 flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      <span>{test.description}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </aside>

        {/* Right: tabs */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 min-w-0">

          {/* Tab bar */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
            {visibleTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-3 text-sm font-medium capitalize border-b-2 ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab}

                {/* Results dot */}
                {tab === 'results' && result && (
                  <span className={`absolute top-2.5 right-2 w-2 h-2 rounded-full ${result.success ? 'bg-green-500' : 'bg-red-500'}`} />
                )}

                {/* Preview stale dot */}
                {tab === 'preview' && activeTab !== 'preview' && isPreviewStale && (
                  <span className="absolute top-2.5 right-2 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content
              The code editor and preview iframe are kept mounted (hidden via CSS)
              so they don't lose state or reload when switching tabs. */}
          <div className="flex-1 relative overflow-hidden">

            {/* Code tab */}
            <div className={`absolute inset-0 flex flex-col ${activeTab === 'code' ? 'flex' : 'hidden'}`}>
              {/* File sub-tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 flex-shrink-0 px-2 pt-1">
                {challenge.files?.map(file => (
                  <button
                    key={file.name}
                    onClick={() => setActiveFile(file.name)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-t border border-b-0 transition-colors ${
                      activeFile === file.name
                        ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700'
                        : 'bg-transparent text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>

              {/* Editor for each file — all stay mounted, hidden via CSS */}
              {challenge.files?.map(file => (
                <div
                  key={file.name}
                  className={`flex-1 min-h-0 ${activeFile === file.name ? 'block' : 'hidden'}`}
                >
                  <CodeEditor
                    value={files[file.name] || ''}
                    onChange={val => setFiles(prev => ({ ...prev, [file.name]: val }))}
                    height="100%"
                    language={file.language}
                    className="rounded-none"
                    lockedLines={file.lockedLines || 0}
                  />
                </div>
              ))}
            </div>

            {/* Results tab */}
            <div className={`absolute inset-0 overflow-auto ${activeTab === 'results' ? 'block' : 'hidden'}`}>
              {running ? (
                <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <p className="text-sm animate-pulse">Running tests…</p>
                </div>
              ) : (
                <ConsoleOutput
                  results={result?.results}
                  error={result?.error}
                  success={result?.success}
                />
              )}
            </div>

            {/* Preview tab — only rendered for supported languages */}
            {hasPreview && (
              <div className={`absolute inset-0 ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
                <PreviewFrame
                  files={debouncedFiles}
                  language={challenge.language}
                  isStale={isPreviewStale}
                />
              </div>
            )}
          </div>

          {/* Action bar */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Reset Code
              </button>
              {hasPreview && activeTab !== 'preview' && (
                <button
                  onClick={() => setActiveTab('preview')}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Open Preview
                </button>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitDisabled}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-sm"
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
