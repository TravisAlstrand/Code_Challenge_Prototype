import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { useTheme } from '../context/ThemeContext'

const JS_EXTENSIONS = [javascript({ jsx: false })]

export default function CodeEditor({ value, onChange, height = '300px', readOnly = false }) {
  const { darkMode } = useTheme()

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 text-sm">
      <CodeMirror
        value={value}
        height={height}
        extensions={JS_EXTENSIONS}
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
