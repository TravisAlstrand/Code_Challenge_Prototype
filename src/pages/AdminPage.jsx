import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import useChallenges from '../hooks/useChallenges'
import CodeEditor from '../components/CodeEditor'
import TestItem from '../components/TestItem'

const DEFAULT_STARTERS = {
  javascript: `function solution(/* params */) {
  // Your code here
}

exports.solution = solution;
`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Page</title>
</head>
<body>
  <!-- Write your HTML here -->

</body>
</html>
`,
}

const ASSERTION_HINTS = {
  javascript: 'return exports.myFn(args) === expectedValue;',
  html: 'return document.querySelector("h1")?.textContent?.trim() === "Hello";',
}

function emptyChallenge() {
  return {
    id: null,
    title: '',
    language: 'javascript',
    description: '',
    starterCode: DEFAULT_STARTERS.javascript,
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

  // When the language changes, swap in the appropriate default starter code
  // if the current starter code is still one of our defaults (i.e. not customised).
  const handleLanguageChange = (newLang) => {
    setForm(prev => {
      const isStillDefault = Object.values(DEFAULT_STARTERS).includes(prev.starterCode)
      return {
        ...prev,
        language: newLang,
        starterCode: isStillDefault ? (DEFAULT_STARTERS[newLang] ?? prev.starterCode) : prev.starterCode,
      }
    })
    setSaveStatus('idle')
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

  const starterSubtitle = lang === 'html'
    ? 'Write the HTML the student will start with'
    : <span>Use <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">exports.fnName = fnName</code> to expose functions to tests</span>

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
              placeholder="e.g. Build a Navigation Bar"
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
              <option value="python" disabled>Python (coming soon)</option>
            </select>
          </Field>
        </Section>

        {/* ── Description ────────────────────────────────────── */}
        <Section title="Task Description" subtitle="Markdown is supported">
          <textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder={`## Challenge Title\n\nDescribe what the student needs to implement.`}
            rows={10}
            className={`${inputClass} font-mono text-sm resize-y`}
          />
        </Section>

        {/* ── Starter Code ───────────────────────────────────── */}
        <Section title="Starter Code" subtitle={starterSubtitle}>
          <CodeEditor
            value={form.starterCode}
            onChange={val => update('starterCode', val)}
            height="220px"
            language={lang}
          />
        </Section>

        {/* ── Tests ──────────────────────────────────────────── */}
        <Section
          title="Tests"
          subtitle="Tests run sequentially and stop at the first failure"
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
