/**
 * Challenge execution engine.
 *
 * Dispatches to a language-specific executor based on challenge.language.
 * Each executor returns the same shape:
 *   { success: boolean, results: Array, error: string|null }
 *
 * Adding a new language: implement an executeXxx function below and add it
 * to the EXECUTORS map.
 */

// ─── JavaScript ────────────────────────────────────────────────────────────────

function executeJavaScript(code, tests) {
  const exports = {}

  try {
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

function executeHtml(code, tests) {
  let doc

  try {
    const parser = new DOMParser()
    doc = parser.parseFromString(code, 'text/html')
  } catch (err) {
    return { success: false, results: [], error: `Parse Error: ${err.message}` }
  }

  return runTests(tests, (assertion) => {
    const testFn = new Function('document', assertion)
    return testFn(doc)
  })
}

// ─── Dispatcher ────────────────────────────────────────────────────────────────

const EXECUTORS = {
  javascript: executeJavaScript,
  html: executeHtml,
}

/**
 * @param {string} language  - challenge.language
 * @param {string} code      - student's submitted code
 * @param {Array}  tests     - array of { id, description, assertion, failureMessage }
 * @returns {{ success: boolean, results: Array, error: string|null }}
 */
export function executeChallenge(language, code, tests) {
  const executor = EXECUTORS[language?.toLowerCase()]

  if (!executor) {
    return {
      success: false,
      results: [],
      error: `No executor available for language: "${language}"`,
    }
  }

  return executor(code, tests)
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
