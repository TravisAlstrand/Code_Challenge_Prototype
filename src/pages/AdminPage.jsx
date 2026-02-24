import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import useChallenges from '../hooks/useChallenges'
import CodeEditor from '../components/CodeEditor'
import TestItem from '../components/TestItem'
import { DIFFICULTIES, difficultyLabel } from '../utils/difficultyBadge'
import { createDefaultFile, languageFromFilename, MAX_FILES, DEFAULT_FILE_CODE } from '../utils/fileDefaults'
import { langBadgeClass, langDisplayName } from '../utils/langBadge'

const ASSERTION_HINTS = {
  javascript: 'return exports.myFn(args) === expectedValue;',
  html: 'return document.querySelector("h1")?.textContent?.trim() === "Hello";',
  css: 'return getComputedStyle(container.querySelector(".my-class")).display === "flex";',
  python: 'solution(args) == expected_value',
}

function emptyChallenge() {
  return {
    id: null,
    title: '',
    languages: ['javascript'],
    difficulty: 'beginner',
    description: `Describe what the student needs to implement.

### Requirements
1. Task 1
2. Task 2

### Tips
- Tip 1
- Tip 2
`,
    files: [createDefaultFile('javascript')],
    tests: [],
  }
}

export default function AdminPage() {
  const { id } = useParams()
  const { getChallengeById, saveChallenge } = useChallenges()

  const [form, setForm] = useState(emptyChallenge)
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle' | 'saved'
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  const isMulti = Array.isArray(form.steps) && form.steps.length > 0

  useEffect(() => {
    if (id) {
      const challenge = getChallengeById(id)
      if (challenge) setForm(challenge)
    } else {
      setForm(emptyChallenge())
    }
    setActiveStepIndex(0)
  }, [id])

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setSaveStatus('idle')
  }

  // Toggle a language in the languages array
  const handleLanguageToggle = (lang) => {
    setForm(prev => {
      const current = prev.languages || []
      const has = current.includes(lang)
      let next

      if (has) {
        if (current.length <= 1) return prev // must keep at least one
        next = current.filter(l => l !== lang)
      } else {
        next = [...current, lang]
      }

      // For single-step: if files are still at defaults for old primary, swap to new primary
      if (!isMulti) {
        const oldPrimary = current[0]
        const newPrimary = next[0]
        if (oldPrimary !== newPrimary) {
          const isDefault = prev.files.length === 1
            && DEFAULT_FILE_CODE[oldPrimary] === prev.files[0].code
          if (isDefault) {
            return { ...prev, languages: next, files: [createDefaultFile(newPrimary)] }
          }
        }
      }

      return { ...prev, languages: next }
    })
    setSaveStatus('idle')
  }

  // ── Step management ──────────────────────────────────────────────

  const updateStep = (stepIndex, field, value) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map((s, i) => i === stepIndex ? { ...s, [field]: value } : s),
    }))
    setSaveStatus('idle')
  }

  const addStep = () => {
    const newStep = {
      id: uuidv4(),
      title: `Step ${form.steps.length + 1}`,
      description: '',
      language: form.languages?.[0] || 'javascript',
      files: [],
      tests: [],
    }
    setForm(prev => ({ ...prev, steps: [...prev.steps, newStep] }))
    setActiveStepIndex(form.steps.length)
    setSaveStatus('idle')
  }

  const removeStep = (index) => {
    if (form.steps.length <= 1) {
      alert('A multi-step challenge must have at least 1 step. Use "Convert to Single-Step" to remove steps.')
      return
    }
    setForm(prev => ({ ...prev, steps: prev.steps.filter((_, i) => i !== index) }))
    setActiveStepIndex(prev => Math.min(prev, form.steps.length - 2))
    setSaveStatus('idle')
  }

  const moveStep = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= form.steps.length) return
    setForm(prev => {
      const steps = [...prev.steps]
      ;[steps[index], steps[target]] = [steps[target], steps[index]]
      return { ...prev, steps }
    })
    setActiveStepIndex(target)
    setSaveStatus('idle')
  }

  const convertToMultiStep = () => {
    setForm(prev => ({
      ...prev,
      steps: [{
        id: uuidv4(),
        title: 'Step 1',
        description: '',
        language: prev.languages?.[0] || 'javascript',
        files: prev.files || [],
        tests: prev.tests || [],
      }],
      files: undefined,
      tests: undefined,
    }))
    setActiveStepIndex(0)
    setSaveStatus('idle')
  }

  const convertToSingleStep = () => {
    if (form.steps.length !== 1) {
      alert('Can only convert to single-step when there is exactly 1 step.')
      return
    }
    const step = form.steps[0]
    setForm(prev => ({
      ...prev,
      files: step.files.length > 0 ? step.files : [createDefaultFile(prev.languages?.[0] || 'javascript')],
      tests: step.tests || [],
      steps: undefined,
    }))
    setSaveStatus('idle')
  }

  // ── File/test operations (scoped to current step or top-level) ──

  const currentFiles = isMulti ? (form.steps[activeStepIndex]?.files || []) : (form.files || [])
  const currentTests = isMulti ? (form.steps[activeStepIndex]?.tests || []) : (form.tests || [])
  const currentLang = isMulti
    ? (form.steps[activeStepIndex]?.language || form.languages?.[0] || 'javascript')
    : (form.languages?.[0] || 'javascript')

  const setCurrentFiles = (newFiles) => {
    if (isMulti) {
      updateStep(activeStepIndex, 'files', newFiles)
    } else {
      update('files', newFiles)
    }
  }

  const setCurrentTests = (newTests) => {
    if (isMulti) {
      updateStep(activeStepIndex, 'tests', newTests)
    } else {
      update('tests', newTests)
    }
  }

  const addFile = (fileLanguage) => {
    if (currentFiles.length >= MAX_FILES) {
      alert(`Maximum ${MAX_FILES} files per ${isMulti ? 'step' : 'challenge'}.`)
      return
    }
    const newFile = createDefaultFile(fileLanguage)
    const existingNames = new Set(currentFiles.map(f => f.name))
    if (existingNames.has(newFile.name)) {
      let counter = 2
      const dot = newFile.name.lastIndexOf('.')
      const base = dot > 0 ? newFile.name.slice(0, dot) : newFile.name
      const ext = dot > 0 ? newFile.name.slice(dot) : ''
      while (existingNames.has(`${base} (${counter})${ext}`)) counter++
      newFile.name = `${base} (${counter})${ext}`
    }
    setCurrentFiles([...currentFiles, newFile])
  }

  const updateFile = (index, field, value) => {
    setCurrentFiles(currentFiles.map((f, i) => i === index ? { ...f, [field]: value } : f))
  }

  const deleteFile = (index) => {
    if (currentFiles.length <= 1) {
      alert(`${isMulti ? 'Step' : 'Challenge'} must have at least one file.`)
      return
    }
    setCurrentFiles(currentFiles.filter((_, i) => i !== index))
  }

  const renameFile = (index, newName) => {
    if (!newName.trim()) return
    const existing = currentFiles.map((f, i) => i !== index ? f.name : null).filter(Boolean)
    if (existing.includes(newName.trim())) return
    const language = languageFromFilename(newName.trim())
    setCurrentFiles(currentFiles.map((f, i) =>
      i === index ? { ...f, name: newName.trim(), language } : f
    ))
  }

  const addTest = () => {
    setCurrentTests([...currentTests, { id: uuidv4(), description: '', assertion: '', failureMessage: '' }])
  }

  const updateTest = (index, updated) => {
    setCurrentTests(currentTests.map((t, i) => (i === index ? updated : t)))
  }

  const deleteTest = (index) => {
    setCurrentTests(currentTests.filter((_, i) => i !== index))
  }

  const duplicateTest = (index) => {
    const original = currentTests[index]
    if (!original) return
    const copy = { ...original, id: uuidv4() }
    setCurrentTests([...currentTests, copy])
  }

  const moveTest = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= currentTests.length) return
    const updated = [...currentTests]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setCurrentTests(updated)
  }

  const handleSave = () => {
    if (!form.title.trim()) {
      alert('Please add a challenge title before saving.')
      return
    }

    if (isMulti) {
      for (let i = 0; i < form.steps.length; i++) {
        const step = form.steps[i]
        if (!step.title?.trim()) {
          alert(`Step ${i + 1} needs a title.`)
          return
        }
        if (!step.tests || step.tests.length === 0) {
          alert(`Step ${i + 1} needs at least one test.`)
          return
        }
      }

      // Warn about duplicate filenames across steps
      const allNames = form.steps.flatMap(s => (s.files || []).map(f => f.name))
      const duplicates = allNames.filter((n, i) => allNames.indexOf(n) !== i)
      if (duplicates.length > 0) {
        if (!window.confirm(`Duplicate filenames across steps: ${[...new Set(duplicates)].join(', ')}. Only the first occurrence will be used. Continue?`)) {
          return
        }
      }
    }

    const saved = saveChallenge(form)

    if (!form.id) {
      setForm(prev => ({ ...prev, id: saved.id }))
      window.history.replaceState(null, '', `/admin/${saved.id}`)
    }

    setSaveStatus('saved')
  }

  const isEditing = Boolean(id || form.id)

  const testsSubtitle = {
    css: <span>Assertions receive <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">container</code> and <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">getComputedStyle</code></span>,
    python: 'Assertions are Python expressions (no return keyword) that evaluate to True or False',
  }[currentLang] ?? 'Tests run sequentially and stop at the first failure'

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-200">Challenges</Link>
            <span>/</span>
            <span>{isEditing ? 'Edit Challenge' : 'New Challenge'}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? (form.title || 'Untitled Challenge') : 'New Challenge'}
          </h1>
        </div>

        <SaveButton status={saveStatus} onClick={handleSave} />
      </div>

      <div className="space-y-6">
        {/* ── Details ────────────────────────────────────────── */}
        <Section title="Challenge Details">
          <Field label="Title">
            <input
              type="text"
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder="e.g. Center Elements with Flexbox"
              className={inputClass}
            />
          </Field>

          <Field label={isMulti ? 'Languages (display badges)' : 'Languages'}>
            <div className="flex flex-wrap gap-2">
              {['javascript', 'html', 'css', 'python'].map(lang => {
                const checked = (form.languages || []).includes(lang)
                return (
                  <label
                    key={lang}
                    className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium border cursor-pointer transition-colors ${
                      checked
                        ? `${langBadgeClass(lang)} border-transparent`
                        : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleLanguageToggle(lang)}
                      className="sr-only"
                    />
                    {langDisplayName(lang)}
                  </label>
                )
              })}
            </div>
          </Field>

          <Field label="Difficulty">
            <select
              value={form.difficulty ?? 'beginner'}
              onChange={e => update('difficulty', e.target.value)}
              className={`${inputClass} w-auto`}
            >
              {DIFFICULTIES.map(d => (
                <option key={d} value={d}>{difficultyLabel(d)}</option>
              ))}
            </select>
          </Field>

          {!isMulti && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={convertToMultiStep}
                className="text-sm px-4 py-2 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-medium"
              >
                Convert to Multi-Step Challenge
              </button>
            </div>
          )}
        </Section>

        {/* ── Description ────────────────────────────────────── */}
        <Section title={isMulti ? 'Overview Description' : 'Task Description'} subtitle={isMulti ? 'Shown at the top of the challenge, before step-specific content' : 'Markdown is supported'}>
          <textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder={isMulti ? 'Overall challenge overview...' : 'Describe what the student needs to implement.'}
            rows={isMulti ? 4 : 10}
            className={`${inputClass} font-mono text-sm resize-y`}
          />
        </Section>

        {/* ── Multi-step: Step management ──────────────────────── */}
        {isMulti && (
          <Section
            title="Steps"
            subtitle="Each step has its own description, files, and tests. Students complete steps sequentially."
            action={
              <div className="flex items-center gap-2">
                {form.steps.length === 1 && (
                  <button
                    onClick={convertToSingleStep}
                    className="text-sm px-3 py-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                  >
                    Convert to Single-Step
                  </button>
                )}
                <button
                  onClick={addStep}
                  className="text-sm px-4 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-medium border border-indigo-200 dark:border-indigo-800"
                >
                  + Add Step
                </button>
              </div>
            }
          >
            {/* Step tabs */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              {form.steps.map((step, i) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStepIndex(i)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                    i === activeStepIndex
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                      : 'bg-transparent text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Step {i + 1}{step.title ? `: ${step.title}` : ''}
                </button>
              ))}
            </div>

            {/* Active step editor */}
            {form.steps[activeStepIndex] && (
              <StepEditor
                step={form.steps[activeStepIndex]}
                stepIndex={activeStepIndex}
                totalSteps={form.steps.length}
                currentFiles={currentFiles}
                currentTests={currentTests}
                currentLang={currentLang}
                testsSubtitle={testsSubtitle}
                onUpdateStep={(field, value) => updateStep(activeStepIndex, field, value)}
                onAddFile={addFile}
                onUpdateFile={updateFile}
                onDeleteFile={deleteFile}
                onRenameFile={renameFile}
                onAddTest={addTest}
                onUpdateTest={updateTest}
                onDeleteTest={deleteTest}
                onDuplicateTest={duplicateTest}
                onMoveTest={moveTest}
                onMoveStep={moveStep}
                onRemoveStep={removeStep}
              />
            )}
          </Section>
        )}

        {/* ── Single-step: Files ─────────────────────────────── */}
        {!isMulti && (
          <Section
            title="Files"
            subtitle="Each file has its own code editor. Students see file tabs in the Code panel."
            action={
              currentFiles.length < MAX_FILES && (
                <select
                  onChange={e => { if (e.target.value) { addFile(e.target.value); e.target.value = '' } }}
                  className={`${inputClass} w-auto text-sm`}
                  defaultValue=""
                >
                  <option value="" disabled>+ Add File…</option>
                  <option value="javascript">JavaScript (.js)</option>
                  <option value="html">HTML (.html)</option>
                  <option value="css">CSS (.css)</option>
                  <option value="python">Python (.py)</option>
                </select>
              )
            }
          >
            <FileList
              files={currentFiles}
              onUpdateFile={updateFile}
              onDeleteFile={deleteFile}
              onRenameFile={renameFile}
              minFiles={1}
            />
          </Section>
        )}

        {/* ── Single-step: Tests ─────────────────────────────── */}
        {!isMulti && (
          <Section
            title="Tests"
            subtitle={testsSubtitle}
            action={
              <button
                onClick={addTest}
                className="text-sm px-4 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-medium border border-indigo-200 dark:border-indigo-800"
              >
                + Add Test
              </button>
            }
          >
            <TestList
              tests={currentTests}
              lang={currentLang}
              onAddTest={addTest}
              onUpdateTest={updateTest}
              onDeleteTest={deleteTest}
              onDuplicateTest={duplicateTest}
              onMoveTest={moveTest}
            />
          </Section>
        )}

        {/* Removed — Convert to Multi-Step is now inside Challenge Details */}

        {/* Bottom save */}
        <div className="flex justify-end pb-8">
          <SaveButton status={saveStatus} onClick={handleSave} large />
        </div>
      </div>
    </div>
  )
}

/* ── Step editor component ─────────────────────────────────────── */

function StepEditor({
  step, stepIndex, totalSteps,
  currentFiles, currentTests, currentLang, testsSubtitle,
  onUpdateStep,
  onAddFile, onUpdateFile, onDeleteFile, onRenameFile,
  onAddTest, onUpdateTest, onDeleteTest, onDuplicateTest, onMoveTest,
  onMoveStep, onRemoveStep,
}) {
  return (
    <div className="space-y-5 pt-2">
      {/* Step header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-3">
          <Field label="Step Title">
            <input
              type="text"
              value={step.title}
              onChange={e => onUpdateStep('title', e.target.value)}
              placeholder={`e.g. Create the HTML structure`}
              className={inputClass}
            />
          </Field>
          <Field label="Step Language (determines test executor)">
            <select
              value={step.language || 'javascript'}
              onChange={e => onUpdateStep('language', e.target.value)}
              className={`${inputClass} w-auto`}
            >
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
            </select>
          </Field>
        </div>
      </div>

      {/* Step description */}
      <Field label="Step Description">
        <textarea
          value={step.description}
          onChange={e => onUpdateStep('description', e.target.value)}
          placeholder="Instructions for this step (Markdown supported)..."
          rows={5}
          className={`${inputClass} font-mono text-sm resize-y`}
        />
      </Field>

      {/* Step files */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Files Introduced</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">New files that appear when the student reaches this step</p>
          </div>
          {currentFiles.length < MAX_FILES && (
            <select
              onChange={e => { if (e.target.value) { onAddFile(e.target.value); e.target.value = '' } }}
              className={`${inputClass} w-auto text-sm`}
              defaultValue=""
            >
              <option value="" disabled>+ Add File…</option>
              <option value="javascript">JavaScript (.js)</option>
              <option value="html">HTML (.html)</option>
              <option value="css">CSS (.css)</option>
              <option value="python">Python (.py)</option>
            </select>
          )}
        </div>
        {currentFiles.length === 0 ? (
          <div className="py-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">No files for this step — files from previous steps carry over</p>
          </div>
        ) : (
          <FileList
            files={currentFiles}
            onUpdateFile={onUpdateFile}
            onDeleteFile={onDeleteFile}
            onRenameFile={onRenameFile}
            minFiles={0}
          />
        )}
      </div>

      {/* Step tests */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tests</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{testsSubtitle}</p>
          </div>
          <button
            onClick={onAddTest}
            className="text-sm px-4 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 font-medium border border-indigo-200 dark:border-indigo-800"
          >
            + Add Test
          </button>
        </div>
        <TestList
          tests={currentTests}
          lang={currentLang}
          onAddTest={onAddTest}
          onUpdateTest={onUpdateTest}
          onDeleteTest={onDeleteTest}
          onDuplicateTest={onDuplicateTest}
          onMoveTest={onMoveTest}
        />
      </div>

      {/* Step actions (move/remove) */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onMoveStep(stepIndex, -1)}
          disabled={stepIndex === 0}
          className="text-sm px-3 py-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Move Up
        </button>
        <button
          onClick={() => onMoveStep(stepIndex, 1)}
          disabled={stepIndex >= totalSteps - 1}
          className="text-sm px-3 py-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Move Down →
        </button>
        <div className="flex-1" />
        {totalSteps > 1 && (
          <button
            onClick={() => onRemoveStep(stepIndex)}
            className="text-sm px-3 py-1.5 rounded text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Remove Step
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Shared sub-components ─────────────────────────────────────── */

function FileList({ files, onUpdateFile, onDeleteFile, onRenameFile, minFiles = 1 }) {
  return (
    <div className="space-y-3">
      {files.map((file, i) => (
        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {/* File header */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={file.name}
              onChange={e => onRenameFile(i, e.target.value)}
              className="text-sm font-mono bg-transparent border-none outline-none text-gray-900 dark:text-white flex-1 min-w-0"
            />
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${langBadgeClass(file.language)}`}>
              {langDisplayName(file.language)}
            </span>
            {file.language === 'javascript' && (
              <label className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap cursor-pointer">
                <input
                  type="checkbox"
                  checked={file.lockedLines > 0}
                  onChange={e => onUpdateFile(i, 'lockedLines', e.target.checked ? 2 : 0)}
                />
                Lock exports
              </label>
            )}
            {files.length > minFiles && (
              <button
                onClick={() => onDeleteFile(i)}
                className="text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400 px-2 py-1 rounded"
              >
                Remove
              </button>
            )}
          </div>
          {/* Code editor */}
          <CodeEditor
            value={file.code}
            onChange={val => onUpdateFile(i, 'code', val)}
            height="200px"
            language={file.language}
            className="rounded-none"
          />
        </div>
      ))}
    </div>
  )
}

function TestList({ tests, lang, onAddTest, onUpdateTest, onDeleteTest, onDuplicateTest, onMoveTest }) {
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  if (tests.length === 0) {
    return (
      <div
        className="py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600"
        onClick={onAddTest}
      >
        <p className="text-sm text-gray-400 dark:text-gray-500">No tests yet — click to add one</p>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      {tests.map((test, i) => (
        <div
          key={test.id}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragEnd={() => { if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) onMoveTest(dragIndex, dragOverIndex); setDragIndex(null); setDragOverIndex(null) }}
          onDragOver={(e) => { e.preventDefault(); setDragOverIndex(i) }}
          className={`transition-opacity ${dragIndex === i ? 'opacity-40' : ''} ${dragOverIndex === i && dragIndex !== i ? 'ring-2 ring-indigo-400 rounded-xl' : ''}`}
        >
          <TestItem
            test={test}
            index={i}
            onChange={updated => onUpdateTest(i, updated)}
            onDelete={() => onDeleteTest(i)}
            onDuplicate={() => onDuplicateTest(i)}
            assertionHint={ASSERTION_HINTS[lang]}
          />
        </div>
      ))}
    </div>
  )
}

/* ── Small shared components ───────────────────────────────────── */

const inputClass =
  'w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

function Section({ title, subtitle, action, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function SaveButton({ status, onClick, large = false }) {
  const saved = status === 'saved'
  const base = large ? 'px-8 py-3 text-base' : 'px-5 py-2 text-sm'
  return (
    <button
      onClick={onClick}
      className={`${base} rounded-lg font-medium shadow-sm ${
        saved
          ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      }`}
    >
      {saved ? '✓ Saved' : 'Save Challenge'}
    </button>
  )
}
