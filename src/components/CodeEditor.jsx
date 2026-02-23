import { useMemo } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { useTheme } from '../context/ThemeContext'

function getExtensions(language) {
  switch (language?.toLowerCase()) {
    case 'html': return [html()]
    case 'javascript':
    default:     return [javascript({ jsx: false })]
  }
}

export default function CodeEditor({ value, onChange, height = '300px', readOnly = false, language = 'javascript' }) {
  const { darkMode } = useTheme()
  const extensions = useMemo(() => getExtensions(language), [language])

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 text-sm">
      <CodeMirror
        value={value}
        height={height}
        extensions={extensions}
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
