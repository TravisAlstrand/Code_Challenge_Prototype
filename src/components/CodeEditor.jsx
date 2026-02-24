import { useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { python } from '@codemirror/lang-python'
import { EditorState, StateField } from '@codemirror/state'
import { Decoration, EditorView } from '@codemirror/view'
import { useTheme } from '../context/ThemeContext'

function getExtensions(language) {
  switch (language?.toLowerCase()) {
    case 'html':   return [html()]
    case 'css':    return [css()]
    case 'python': return [python()]
    case 'javascript':
    default:       return [javascript({ jsx: false })]
  }
}

// ── Locked-line extension ───────────────────────────────────────────────────
// Prevents edits to the last `numLines` lines and applies a visual highlight.

const lockedLineDeco = Decoration.line({ class: 'cm-locked-line' })

function buildLockedDecos(state, numLines) {
  const total = state.doc.lines
  const first = Math.max(1, total - numLines + 1)
  const decos = []
  for (let i = first; i <= total; i++) {
    decos.push(lockedLineDeco.range(state.doc.line(i).from))
  }
  return Decoration.set(decos)
}

function createLockedExtension(numLines) {
  if (!numLines) return []

  const decoField = StateField.define({
    create: (state) => buildLockedDecos(state, numLines),
    update: (deco, tr) => tr.docChanged ? buildLockedDecos(tr.state, numLines) : deco,
    provide: (f) => EditorView.decorations.from(f),
  })

  const lockFilter = EditorState.changeFilter.of((tr) => {
    if (!tr.docChanged) return true
    const total = tr.startState.doc.lines
    const first = Math.max(1, total - numLines + 1)
    const lockFrom = tr.startState.doc.line(first).from
    let ok = true
    tr.changes.iterChanges((_fromA, toA) => {
      if (toA >= lockFrom) ok = false
    })
    return ok
  })

  return [decoField, lockFilter]
}

// ── Component ───────────────────────────────────────────────────────────────

export default function CodeEditor({ value, onChange, height = '300px', readOnly = false, language = 'javascript', className = 'rounded-lg', lockedLines = 0 }) {
  const { darkMode } = useTheme()
  const langExtensions = useMemo(() => getExtensions(language), [language])
  const lockedExtension = useMemo(() => createLockedExtension(lockedLines), [lockedLines])

  return (
    <div className={`${className} overflow-hidden border border-gray-200 dark:border-gray-700 text-sm`}>
      <CodeMirror
        value={value}
        height={height}
        extensions={[...langExtensions, ...lockedExtension]}
        onChange={onChange}
        readOnly={readOnly}
        theme={darkMode ? 'dark' : 'light'}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: !readOnly,
          highlightSelectionMatches: true,
          foldGutter: false,
          indentOnInput: true,
          tabSize: 2,
        }}
      />
    </div>
  )
}
