/**
 * Pyodide (Python-in-WebAssembly) runtime loader.
 *
 * Loads Pyodide lazily from the jsDelivr CDN on first use and caches the
 * instance for the lifetime of the page.  Call prewarmPython() as soon as
 * a Python challenge is opened so the ~8 MB download starts early.
 */

const PYODIDE_VERSION = '0.26.4'
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

let pyodideInstance = null
let loadPromise = null

/**
 * Start loading Pyodide in the background.
 * Safe to call multiple times — subsequent calls return the same Promise.
 * @returns {Promise<Pyodide>}
 */
export function prewarmPython() {
  if (loadPromise) return loadPromise
  loadPromise = _load()
  return loadPromise
}

/**
 * Resolve the cached Pyodide instance, loading it first if needed.
 * @returns {Promise<Pyodide>}
 */
export async function getPyodide() {
  if (pyodideInstance) return pyodideInstance
  pyodideInstance = await prewarmPython()
  return pyodideInstance
}

/** Synchronous check — true once Pyodide has fully loaded. */
export function isPythonReady() {
  return pyodideInstance !== null
}

async function _load() {
  // Inject the Pyodide bootstrap script if not already present.
  if (!window.loadPyodide) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `${PYODIDE_CDN}pyodide.js`
      script.onload = resolve
      script.onerror = () => reject(new Error('Failed to load Pyodide from CDN. Check your internet connection.'))
      document.head.appendChild(script)
    })
  }

  const instance = await window.loadPyodide({ indexURL: PYODIDE_CDN })
  pyodideInstance = instance
  return instance
}
