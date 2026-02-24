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

function isMultiStep(challenge) {
  return Array.isArray(challenge?.steps) && challenge.steps.length > 0
}

// Build accumulated file metadata from steps 0..stepIndex
function getAccumulatedFileMeta(challenge, stepIndex) {
  const seen = new Set()
  const meta = []
  for (let i = 0; i <= stepIndex; i++) {
    for (const f of challenge.steps[i].files) {
      if (!seen.has(f.name)) {
        seen.add(f.name)
        meta.push({ ...f, isNew: i === stepIndex })
      }
    }
  }
  return meta
}

// Build the initial files map for a given step index (starters only)
function buildStepFiles(challenge, stepIndex) {
  const fileMap = {}
  for (let i = 0; i <= stepIndex; i++) {
    for (const f of challenge.steps[i].files) {
      if (!(f.name in fileMap)) {
        fileMap[f.name] = f.code
      }
    }
  }
  return fileMap
}

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
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const { markComplete, completeStep, getStepProgress, resetStepProgress } = useProgress()

  // Debounced files map for preview rendering
  const debouncedFiles = useDebounce(files, 650)
  const isPreviewStale = useMemo(
    () => JSON.stringify(files) !== JSON.stringify(debouncedFiles),
    [files, debouncedFiles]
  )

  useEffect(() => {
    const c = getChallengeById(id)
    if (!c) return
    setChallenge(c)

    if (isMultiStep(c)) {
      const progress = getStepProgress(c.id)
      const stepIdx = progress?.currentStep ?? 0
      setCurrentStepIndex(stepIdx)
      const fileMap = buildStepFiles(c, stepIdx)
      setFiles(fileMap)
      setActiveFile(c.steps[stepIdx].files[0]?.name || Object.keys(fileMap)[0] || '')
    } else {
      const fileMap = {}
      c.files?.forEach(f => { fileMap[f.name] = f.code })
      setFiles(fileMap)
      setActiveFile(c.files?.[0]?.name || '')
    }
  }, [id])

  // Pre-warm Pyodide for Python challenges
  useEffect(() => {
    if (!challenge) return
    const needsPython = isMultiStep(challenge)
      ? challenge.steps.some(s => s.language?.toLowerCase() === 'python')
      : (challenge.languages || []).some(l => l.toLowerCase() === 'python')

    if (needsPython) {
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

  const multiStep = isMultiStep(challenge)
  const currentStep = multiStep ? challenge.steps[currentStepIndex] : null
  const totalSteps = multiStep ? challenge.steps.length : 0

  // For multi-step, determine executor language and tests from current step
  const execLanguage = multiStep ? currentStep.language : (challenge.languages?.[0] || 'javascript')
  const currentTests = multiStep ? currentStep.tests : challenge.tests

  const hasPreview = multiStep
    ? Object.keys(files).some(name => /\.(html?|css|js)$/i.test(name))
    : (challenge.languages || []).some(l => PREVIEWABLE.includes(l.toLowerCase()))
  const isPython = multiStep
    ? challenge.steps.some(s => s.language?.toLowerCase() === 'python')
    : (challenge.languages || []).some(l => l.toLowerCase() === 'python')

  const visibleTabs = hasPreview ? TABS : TABS.filter(t => t !== 'preview')

  const submitDisabled = running || (isPython && !pythonReady)
  const submitLabel = running
    ? 'Running…'
    : (isPython && !pythonReady)
    ? 'Loading Python…'
    : 'Submit'

  // Build file meta for tabs (multi-step uses accumulated files, single-step uses challenge.files)
  const fileMeta = multiStep
    ? getAccumulatedFileMeta(challenge, currentStepIndex)
    : challenge.files || []

  const stepPassed = result?.success && multiStep
  const hasNextStep = multiStep && currentStepIndex < totalSteps - 1

  const handleSubmit = async () => {
    setRunning(true)
    setActiveTab('results')
    const output = await executeChallenge(execLanguage, files, currentTests)
    setResult(output)
    if (output.success) {
      if (multiStep) {
        completeStep(challenge.id, currentStepIndex, totalSteps)
      } else {
        markComplete(challenge.id)
      }
    }
    setRunning(false)
  }

  const handleReset = () => {
    const msg = multiStep
      ? 'Reset the current step\'s files to starter code?'
      : 'Reset your code back to the starter code?'
    if (!window.confirm(msg)) return

    if (multiStep) {
      setFiles(prev => {
        const updated = { ...prev }
        for (const f of currentStep.files) {
          updated[f.name] = f.code
        }
        return updated
      })
    } else {
      const fileMap = {}
      challenge.files?.forEach(f => { fileMap[f.name] = f.code })
      setFiles(fileMap)
      setActiveFile(challenge.files?.[0]?.name || '')
    }
    setResult(null)
  }

  const advanceToNextStep = () => {
    if (!hasNextStep) return
    const nextIdx = currentStepIndex + 1
    const nextStep = challenge.steps[nextIdx]

    setCurrentStepIndex(nextIdx)

    // Add new files from next step without overwriting existing edits
    setFiles(prev => {
      const updated = { ...prev }
      for (const f of nextStep.files) {
        if (!(f.name in updated)) {
          updated[f.name] = f.code
        }
      }
      return updated
    })

    setActiveFile(nextStep.files[0]?.name || activeFile)
    setResult(null)
    setActiveTab('code')
  }

  const handleResetAllSteps = () => {
    if (!window.confirm('Reset all progress for this challenge? This will start you back at Step 1.')) return
    resetStepProgress(challenge.id)
    setCurrentStepIndex(0)
    const fileMap = buildStepFiles(challenge, 0)
    setFiles(fileMap)
    setActiveFile(challenge.steps[0].files[0]?.name || '')
    setResult(null)
    setActiveTab('code')
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
                <div className="flex flex-wrap gap-1 mt-1">
                  {(challenge.languages || []).map(lang => (
                    <span key={lang} className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${langBadgeClass(lang)}`}>
                      {langDisplayName(lang)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Multi-step: step progress + current step content ── */}
            {multiStep ? (
              <>
                {/* Overall description */}
                {challenge.description && (
                  <div className="mb-4">
                    <MarkdownRenderer content={challenge.description} />
                  </div>
                )}

                {/* Step progress indicator */}
                <div className="mb-5">
                  <div className="flex items-center gap-1 mb-3">
                    {challenge.steps.map((step, i) => {
                      const progress = getStepProgress(challenge.id)
                      const isCompleted = progress?.completedSteps?.includes(i)
                      const isCurrent = i === currentStepIndex
                      const isFuture = i > currentStepIndex

                      return (
                        <div key={step.id} className="flex items-center gap-1 flex-1">
                          <button
                            onClick={() => {
                              if (!isFuture) {
                                setCurrentStepIndex(i)
                                // Ensure files include everything up to this step
                                setFiles(prev => {
                                  const updated = { ...prev }
                                  for (let s = 0; s <= i; s++) {
                                    for (const f of challenge.steps[s].files) {
                                      if (!(f.name in updated)) updated[f.name] = f.code
                                    }
                                  }
                                  return updated
                                })
                                setActiveFile(challenge.steps[i].files[0]?.name || activeFile)
                                setResult(null)
                              }
                            }}
                            disabled={isFuture}
                            className={`
                              w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 transition-colors
                              ${isCurrent
                                ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 dark:ring-indigo-500/50'
                                : isCompleted
                                  ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              }
                            `}
                            title={step.title}
                          >
                            {isCompleted && !isCurrent ? '✓' : i + 1}
                          </button>
                          {i < challenge.steps.length - 1 && (
                            <div className={`flex-1 h-0.5 rounded ${
                              isCompleted ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'
                            }`} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Step {currentStepIndex + 1} of {totalSteps}: {currentStep.title}
                  </p>
                </div>

                {/* Current step description */}
                <MarkdownRenderer content={currentStep.description} />

                {/* Current step test list */}
                {currentTests.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                      {currentTests.length} Test{currentTests.length !== 1 ? 's' : ''}
                    </h3>
                    <ol className="space-y-1.5">
                      {currentTests.map((test, i) => (
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
              </>
            ) : (
              /* ── Single-step: original layout ── */
              <>
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
              </>
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

          {/* Tab content */}
          <div className="flex-1 relative overflow-hidden">

            {/* Code tab */}
            <div className={`absolute inset-0 flex flex-col ${activeTab === 'code' ? 'flex' : 'hidden'}`}>
              {/* File sub-tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 flex-shrink-0 px-2 pt-1">
                {fileMeta.map(file => (
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
                    {multiStep && file.isNew && (
                      <span className="ml-1.5 text-[10px] font-semibold text-indigo-500 dark:text-indigo-400">NEW</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Editor for each file — all stay mounted, hidden via CSS */}
              {fileMeta.map(file => (
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
                <>
                  <ConsoleOutput
                    results={result?.results}
                    error={result?.error}
                    success={result?.success}
                  />
                  {/* "Continue to Next Step" prompt after passing */}
                  {stepPassed && hasNextStep && (
                    <div className="p-4 mx-4 mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
                        Step {currentStepIndex + 1} complete!
                      </p>
                      <button
                        onClick={advanceToNextStep}
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm"
                      >
                        Continue to Step {currentStepIndex + 2}
                      </button>
                    </div>
                  )}
                  {stepPassed && !hasNextStep && (
                    <div className="p-4 mx-4 mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        All steps complete! Challenge finished.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Preview tab */}
            {hasPreview && (
              <div className={`absolute inset-0 ${activeTab === 'preview' ? 'block' : 'hidden'}`}>
                <PreviewFrame
                  files={debouncedFiles}
                  language={challenge.languages?.[0] || 'javascript'}
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
                {multiStep ? 'Reset Step' : 'Reset Code'}
              </button>
              {multiStep && (
                <button
                  onClick={handleResetAllSteps}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Reset All
                </button>
              )}
              {hasPreview && activeTab !== 'preview' && (
                <button
                  onClick={() => setActiveTab('preview')}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Open Preview
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {stepPassed && hasNextStep && (
                <button
                  onClick={advanceToNextStep}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm"
                >
                  Next Step →
                </button>
              )}
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
    </div>
  )
}
