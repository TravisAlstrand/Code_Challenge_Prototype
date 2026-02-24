import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
    language: 'javascript',
    difficulty: 'beginner',
    description: '',
    files: [createDefaultFile('javascript')],
    tests: [],
  }
}

export default function AdminPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getChallengeById, saveChallenge } = useChallenges()

  const [form, setForm] = useState(emptyChallenge)
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle' | 'saved'

  useEffect(() => {
    if (id) {
      const challenge = getChallengeById(id)
      if (challenge) setForm(challenge)
    } else {
      setForm(emptyChallenge())
    }
  }, [id])

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setSaveStatus('idle')
  }

  // When language changes, swap files if still at defaults
  const handleLanguageChange = (newLang) => {
    setForm(prev => {
      const isDefault = prev.files.length === 1
        && DEFAULT_FILE_CODE[prev.language] === prev.files[0].code
      return {
        ...prev,
        language: newLang,
        files: isDefault ? [createDefaultFile(newLang)] : prev.files,
      }
    })
    setSaveStatus('idle')
  }

  // ── File management ─────────────────────────────────────
  const addFile = (fileLanguage) => {
    if (form.files.length >= MAX_FILES) {
      alert(`Maximum ${MAX_FILES} files per challenge.`)
      return
    }
    const newFile = createDefaultFile(fileLanguage)
    // Avoid name collisions
    const existingNames = new Set(form.files.map(f => f.name))
    if (existingNames.has(newFile.name)) {
      let counter = 2
      const dot = newFile.name.lastIndexOf('.')
      const base = dot > 0 ? newFile.name.slice(0, dot) : newFile.name
      const ext = dot > 0 ? newFile.name.slice(dot) : ''
      while (existingNames.has(`${base} (${counter})${ext}`)) counter++
      newFile.name = `${base} (${counter})${ext}`
    }
    update('files', [...form.files, newFile])
  }

  const updateFile = (index, field, value) => {
    update('files', form.files.map((f, i) => i === index ? { ...f, [field]: value } : f))
  }

  const deleteFile = (index) => {
    if (form.files.length <= 1) {
      alert('Challenge must have at least one file.')
      return
    }
    update('files', form.files.filter((_, i) => i !== index))
  }

  const renameFile = (index, newName) => {
    if (!newName.trim()) return
    const existing = form.files.map((f, i) => i !== index ? f.name : null).filter(Boolean)
    if (existing.includes(newName.trim())) return
    const language = languageFromFilename(newName.trim())
    update('files', form.files.map((f, i) =>
      i === index ? { ...f, name: newName.trim(), language } : f
    ))
  }

  const addTest = () => {
    update('tests', [...form.tests, { id: uuidv4(), description: '', assertion: '', failureMessage: '' }])
  }

  const updateTest = (index, updated) => {
    update('tests', form.tests.map((t, i) => (i === index ? updated : t)))
  }

  const deleteTest = (index) => {
    update('tests', form.tests.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!form.title.trim()) {
      alert('Please add a challenge title before saving.')
      return
    }

    const saved = saveChallenge(form)

    if (!form.id) {
      setForm(prev => ({ ...prev, id: saved.id }))
      window.history.replaceState(null, '', `/admin/${saved.id}`)
    }

    setSaveStatus('saved')
  }

  const isEditing = Boolean(id || form.id)
  const lang = form.language

  const testsSubtitle = {
    css: <span>Assertions receive <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">container</code> and <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">getComputedStyle</code></span>,
    python: 'Assertions are Python expressions (no return keyword) that evaluate to True or False',
  }[lang] ?? 'Tests run sequentially and stop at the first failure'

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

          <Field label="Language">
            <select
              value={form.language}
              onChange={e => handleLanguageChange(e.target.value)}
              className={`${inputClass} w-auto`}
            >
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
            </select>
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
        </Section>

        {/* ── Description ────────────────────────────────────── */}
        <Section title="Task Description" subtitle="Markdown is supported">
          <textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder={`Describe what the student needs to implement.`}
            rows={10}
            className={`${inputClass} font-mono text-sm resize-y`}
          />
        </Section>

        {/* ── Files ───────────────────────────────────────────── */}
        <Section
          title="Files"
          subtitle="Each file has its own code editor. Students see file tabs in the Code panel."
          action={
            form.files.length < MAX_FILES && (
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
          {form.files.map((file, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* File header */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={file.name}
                  onChange={e => renameFile(i, e.target.value)}
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
                      onChange={e => updateFile(i, 'lockedLines', e.target.checked ? 2 : 0)}
                    />
                    Lock exports
                  </label>
                )}
                {form.files.length > 1 && (
                  <button
                    onClick={() => deleteFile(i)}
                    className="text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400 px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
              {/* Code editor for this file */}
              <CodeEditor
                value={file.code}
                onChange={val => updateFile(i, 'code', val)}
                height="200px"
                language={file.language}
                className="rounded-none"
              />
            </div>
          ))}
        </Section>

        {/* ── Tests ──────────────────────────────────────────── */}
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
          {form.tests.length === 0 ? (
            <div
              className="py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600"
              onClick={addTest}
            >
              <p className="text-sm text-gray-400 dark:text-gray-500">No tests yet — click to add one</p>
            </div>
          ) : (
            <div className="space-y-4">
              {form.tests.map((test, i) => (
                <TestItem
                  key={test.id}
                  test={test}
                  index={i}
                  onChange={updated => updateTest(i, updated)}
                  onDelete={() => deleteTest(i)}
                  assertionHint={ASSERTION_HINTS[lang]}
                />
              ))}
            </div>
          )}
        </Section>

        {/* Bottom save */}
        <div className="flex justify-end pb-8">
          <SaveButton status={saveStatus} onClick={handleSave} large />
        </div>
      </div>
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
