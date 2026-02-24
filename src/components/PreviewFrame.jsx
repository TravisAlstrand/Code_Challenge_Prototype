import { useMemo } from 'react'

/**
 * Resolves <link href="file.css"> and <script src="file.js"> references
 * in an HTML string by inlining the matching file contents. Only files
 * that exist in the filesMap are resolved — everything else is left as-is.
 *
 * This mimics real-world file linking: files must be explicitly referenced
 * in the HTML via <link> or <script src> to be included.
 */
function resolveFileReferences(html, filesMap) {
  // <link ... href="filename.css" ...>  →  <style>content</style>
  html = html.replace(/<link\s+[^>]*href="([^"]+)"[^>]*\/?>/gi, (match, href) => {
    const code = filesMap[href]
    if (code !== undefined) return `<style>\n${code}\n</style>`
    return match
  })

  // <script src="filename.js"></script>  →  <script>content</script>
  html = html.replace(/<script\s+[^>]*src="([^"]+)"[^>]*><\/script>/gi, (match, src) => {
    const code = filesMap[src]
    if (code !== undefined) return `<script>\n${code}\n</script>`
    return match
  })

  return html
}

/**
 * Builds a full HTML document string from all challenge files.
 *
 * Files are linked realistically: the HTML file must contain <link> and
 * <script src> tags referencing other files by name. Those references are
 * resolved to inline content for the iframe preview.
 *
 * If no HTML file exists and the primary language is JS, the console-capture
 * shell is used instead.
 */
function buildDocument(files, language) {
  const htmlFiles = []
  const jsFiles = []

  for (const [name, code] of Object.entries(files)) {
    const ext = name.split('.').pop()?.toLowerCase()
    if (ext === 'html' || ext === 'htm') htmlFiles.push({ name, code })
    else if (ext === 'js') jsFiles.push({ name, code })
  }

  // Python-only challenges
  if (language === 'python') {
    return '<p style="color:#888;font-family:sans-serif;padding:16px">Python challenges don\'t have a preview. Submit to run tests.</p>'
  }

  // JS-only (no HTML file) — use the console-capture shell
  if (language === 'javascript' && htmlFiles.length === 0) {
    const allJs = jsFiles.map(f => f.code).join('\n')
    return buildJsConsoleShell(allJs)
  }

  if (htmlFiles.length === 0) {
    return '<p style="color:#888;font-family:sans-serif;padding:16px">Nothing to preview yet.</p>'
  }

  // Resolve <link href> and <script src> references to inline content
  return resolveFileReferences(htmlFiles[0].code, files)
}

/**
 * Builds the JS console-capture shell (same UI as before).
 * Used when a JS challenge has no HTML file.
 */
function buildJsConsoleShell(code) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
      font-size: 12.5px;
      background: #1a1a1a;
      color: #d4d4d4;
      padding: 12px;
      min-height: 100vh;
    }
    .entry {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 3px 0;
      border-bottom: 1px solid #2a2a2a;
      line-height: 1.5;
      word-break: break-word;
    }
    .entry:last-child { border-bottom: none; }
    .gutter { color: #555; flex-shrink: 0; user-select: none; }
    .log    { color: #d4d4d4; }
    .warn   { color: #e5c07b; background: #2a2200; }
    .warn .gutter { color: #e5c07b; }
    .error  { color: #f47b72; background: #2a0a0a; }
    .error .gutter { color: #f47b72; }
    .info   { color: #6cb6ff; }
    .info .gutter { color: #6cb6ff; }
    .empty-state {
      color: #555;
      font-family: sans-serif;
      font-size: 13px;
      padding: 24px 12px;
    }
  </style>
</head>
<body>
<script>
  // Serialise any value to a readable string
  function serialise(v) {
    if (v === null) return 'null'
    if (v === undefined) return 'undefined'
    if (typeof v === 'object') {
      try { return JSON.stringify(v, null, 2) } catch { return String(v) }
    }
    return String(v)
  }

  function appendEntry(level, args) {
    const entry = document.createElement('div')
    entry.className = 'entry ' + level

    const gutter = document.createElement('span')
    gutter.className = 'gutter'
    gutter.textContent = level === 'error' ? '\\u2715' : level === 'warn' ? '\\u25B2' : '\\u203A'

    const text = document.createElement('span')
    text.textContent = args.map(serialise).join(' ')

    entry.appendChild(gutter)
    entry.appendChild(text)
    document.body.appendChild(entry)

    // Remove the empty-state placeholder if present
    const placeholder = document.getElementById('placeholder')
    if (placeholder) placeholder.remove()
  }

  const _log   = console.log.bind(console)
  const _warn  = console.warn.bind(console)
  const _error = console.error.bind(console)
  const _info  = console.info.bind(console)

  console.log   = (...a) => { appendEntry('log',   a); _log(...a)   }
  console.warn  = (...a) => { appendEntry('warn',  a); _warn(...a)  }
  console.error = (...a) => { appendEntry('error', a); _error(...a) }
  console.info  = (...a) => { appendEntry('info',  a); _info(...a)  }

  window.onerror = (msg, _src, line, col) => {
    appendEntry('error', [\`\${msg} (line \${line}:\${col})\`])
    return true
  }
</script>

<div id="placeholder" class="empty-state">
  No output yet — use <strong>console.log()</strong> to print values here.
</div>

<script>
  (function () {
    var exports = {};
    try {
      ${code}
    } catch (e) {
      appendEntry('error', [e.toString()])
    }
  })();
</script>
</body>
</html>`
}

/**
 * PreviewFrame receives already-debounced `files` from the parent.
 * `isStale` controls the loading overlay — shown while the debounce is pending.
 */
export default function PreviewFrame({ files, language, isStale }) {
  const srcDoc = useMemo(
    () => buildDocument(files, language),
    [files, language]
  )

  return (
    <div className="relative w-full h-full">
      {/* Stale overlay — shown briefly while debounce is pending */}
      {isStale && (
        <div className="absolute inset-0 bg-white/30 dark:bg-black/30 z-10 flex items-center justify-center pointer-events-none">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow border border-gray-200 dark:border-gray-700">
            Updating…
          </span>
        </div>
      )}

      <iframe
        key={language} // remount if language changes
        srcDoc={srcDoc}
        sandbox="allow-scripts"
        title="Challenge Preview"
        className="w-full h-full border-0 bg-white"
      />
    </div>
  )
}
