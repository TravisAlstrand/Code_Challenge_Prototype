/**
 * Challenge execution engine.
 *
 * Isolated from UI so future language runners can be swapped in.
 *
 * Execution model (JavaScript):
 *   1. User code is wrapped in a Function that receives an `exports` object.
 *   2. User code assigns functions to `exports` to expose them to tests.
 *   3. Each test assertion is run as a Function that receives `exports`.
 *   4. Tests run sequentially; execution halts at the first failure.
 */

/**
 * @param {string} code        - The user's submitted code
 * @param {Array}  tests       - Array of { id, description, assertion, failureMessage }
 * @returns {{ success: boolean, results: Array, error: string|null }}
 */
export function executeChallenge(code, tests) {
  const exports = {}

  // Step 1: Execute user code
  try {
    const userFn = new Function('exports', code)
    userFn(exports)
  } catch (err) {
    return {
      success: false,
      results: [],
      error: `${err.name}: ${err.message}`,
    }
  }

  // Step 2: Run tests sequentially, stop at first failure
  const results = []

  for (const test of tests) {
    try {
      const testFn = new Function('exports', test.assertion)
      const passed = testFn(exports)

      if (!passed) {
        results.push({
          id: test.id,
          description: test.description,
          passed: false,
          message: test.failureMessage || 'Test returned false',
        })
        // Stop at first failure
        return { success: false, results, error: null }
      }

      results.push({
        id: test.id,
        description: test.description,
        passed: true,
        message: null,
      })
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
