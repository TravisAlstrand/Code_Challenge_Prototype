/**
 * Challenge execution engine.
 *
 * Dispatches to a language-specific executor based on challenge.language.
 * Each executor receives a `files` map ({ [filename]: codeString }) and
 * returns (or resolves to) the same shape:
 *   { success: boolean, results: Array, error: string|null }
 *
 * Adding a new language: implement an executeXxx function below and add it
 * to the EXECUTORS map.
 */

import { getPyodide } from './pythonRuntime'

// ─── Helpers ────────────────────────────────────────────────────────────────

function filesByExt(files, ext) {
  return Object.entries(files).filter(([name]) =>
    name.toLowerCase().endsWith(ext)
  )
}

/** Extract innerHTML of <body> from a full HTML document string. */
function extractBodyContent(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  return match ? match[1].trim() : html
}

/**
 * Resolves <link href="file.css"> and <script src="file.js"> references
 * in an HTML string by inlining the matching file contents.
 */
function resolveFileReferences(html, filesMap) {
  html = html.replace(/<link\s+[^>]*href="([^"]+)"[^>]*\/?>/gi, (match, href) => {
    const code = filesMap[href]
    if (code !== undefined) return `<style>${code}</style>`
    return match
  })

  html = html.replace(/<script\s+[^>]*src="([^"]+)"[^>]*><\/script>/gi, (match, src) => {
    const code = filesMap[src]
    if (code !== undefined) return `<script>${code}</script>`
    return match
  })

  return html
}

// ─── JavaScript ────────────────────────────────────────────────────────────────

function executeJavaScript(files, tests) {
  const jsFiles = filesByExt(files, '.js')
  if (jsFiles.length === 0) {
    return { success: false, results: [], error: 'No JavaScript file found in this challenge.' }
  }

  const exports = {}

  try {
    // Use the first .js file as the primary file with exports
    const code = jsFiles[0][1]
    const userFn = new Function('exports', code)
    userFn(exports)
  } catch (err) {
    return { success: false, results: [], error: `${err.name}: ${err.message}` }
  }

  return runTests(tests, (assertion) => {
    const testFn = new Function('exports', assertion)
    return testFn(exports)
  })
}

// ─── HTML ──────────────────────────────────────────────────────────────────────

function executeHtml(files, tests) {
  const htmlFiles = filesByExt(files, '.html').concat(filesByExt(files, '.htm'))

  let doc = htmlFiles.length > 0 ? htmlFiles[0][1] : '<html><body></body></html>'

  // Resolve <link href> and <script src> references to inline content
  doc = resolveFileReferences(doc, files)

  let parsedDoc
  try {
    const parser = new DOMParser()
    parsedDoc = parser.parseFromString(doc, 'text/html')
  } catch (err) {
    return { success: false, results: [], error: `Parse Error: ${err.message}` }
  }

  return runTests(tests, (assertion) => {
    const testFn = new Function('document', assertion)
    return testFn(parsedDoc)
  })
}

// ─── CSS ───────────────────────────────────────────────────────────────────
//
// Injects the fixture HTML + student CSS into a hidden off-screen container
// attached to the real document so the browser computes styles properly.
// Assertions receive `container` (the root element) and `getComputedStyle`.
// The container is always removed after tests finish.

function executeCss(files, tests) {
  const cssFiles = filesByExt(files, '.css')
  const htmlFiles = filesByExt(files, '.html').concat(filesByExt(files, '.htm'))

  const cssCode = cssFiles.map(([, code]) => code).join('\n')

  // Extract body content from the HTML file as fixture
  let fixtureHtml = ''
  if (htmlFiles.length > 0) {
    fixtureHtml = extractBodyContent(htmlFiles[0][1])
  }

  const container = document.createElement('div')

  // Off-screen but attached to the DOM so getComputedStyle works correctly.
  // A fixed width gives layout-dependent properties (flex, grid) a consistent base.
  container.style.cssText = [
    'position:absolute',
    'left:-9999px',
    'top:0',
    'width:1280px',
    'visibility:hidden',
    'pointer-events:none',
  ].join(';')

  container.innerHTML = fixtureHtml

  const styleEl = document.createElement('style')
  styleEl.textContent = cssCode
  container.appendChild(styleEl)

  document.body.appendChild(container)

  try {
    return runTests(tests, (assertion) => {
      const testFn = new Function('container', 'getComputedStyle', assertion)
      return testFn(container, window.getComputedStyle.bind(window))
    })
  } finally {
    // Always clean up, even if a test throws
    document.body.removeChild(container)
  }
}

// ─── Python ────────────────────────────────────────────────────────────────────
//
// Runs student code via Pyodide (Python compiled to WebAssembly).
// The student's code is executed in a fresh namespace so functions/variables
// they define don't leak between submissions.
//
// Test assertions are plain Python expressions that evaluate to True/False.
// Example:  reverse_string("hello") == "olleh"

async function executePython(files, tests) {
  const pyFiles = filesByExt(files, '.py')
  if (pyFiles.length === 0) {
    return { success: false, results: [], error: 'No Python file found in this challenge.' }
  }

  const code = pyFiles[0][1]

  let pyodide
  try {
    pyodide = await getPyodide()
  } catch (err) {
    return {
      success: false,
      results: [],
      error: `Could not load Python runtime: ${err.message}`,
    }
  }

  // Run the student's code inside a fresh namespace with access to builtins.
  // Source is passed via pyodide.globals to avoid quoting/escaping issues.
  try {
    pyodide.globals.set('_student_source', code)
    pyodide.runPython(`
import builtins as _builtins
_ns = {'__builtins__': _builtins}
exec(_student_source, _ns)
    `)
  } catch (err) {
    return {
      success: false,
      results: [],
      error: `Runtime error:\n${err.message}`,
    }
  }

  // Each assertion is a Python expression evaluated inside the student's namespace.
  return runTests(tests, (assertion) => {
    pyodide.globals.set('_assertion', assertion)
    try {
      const result = pyodide.runPython('eval(_assertion, _ns)')
      return result === true
    } catch (err) {
      throw new Error(err.message)
    }
  })
}

// ─── Dispatcher ────────────────────────────────────────────────────────────────

const EXECUTORS = {
  javascript: executeJavaScript,
  html: executeHtml,
  css: executeCss,
  python: executePython,
}

/**
 * @param {string} language    - challenge.language (primary/test language)
 * @param {Object} files       - { [filename]: codeString } map of all files
 * @param {Array}  tests       - array of { id, description, assertion, failureMessage }
 * @returns {Promise<{ success: boolean, results: Array, error: string|null }>}
 */
export async function executeChallenge(language, files, tests) {
  const executor = EXECUTORS[language?.toLowerCase()]

  if (!executor) {
    return {
      success: false,
      results: [],
      error: `No executor available for language: "${language}"`,
    }
  }

  return executor(files, tests)
}

// ─── Shared test runner ────────────────────────────────────────────────────────

/**
 * Runs tests sequentially, stopping at the first failure.
 * `runAssertion` is a language-specific callback that evaluates one assertion string.
 */
function runTests(tests, runAssertion) {
  const results = []

  for (const test of tests) {
    try {
      const passed = runAssertion(test.assertion)

      if (!passed) {
        results.push({
          id: test.id,
          description: test.description,
          passed: false,
          message: test.failureMessage || 'Test returned false',
        })
        return { success: false, results, error: null }
      }

      results.push({ id: test.id, description: test.description, passed: true, message: null })
    } catch (err) {
      results.push({
        id: test.id,
        description: test.description,
        passed: false,
        message: `${err.name}: ${err.message}`,
      })
      return { success: false, results, error: null }
    }
  }

  return { success: true, results, error: null }
}
