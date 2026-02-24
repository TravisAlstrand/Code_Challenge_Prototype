// Default filenames by language
export const DEFAULT_FILENAMES = {
  javascript: 'app.js',
  html: 'index.html',
  css: 'styles.css',
  python: 'app.py',
}

// Map file extension to language
const EXT_TO_LANGUAGE = {
  '.js': 'javascript',
  '.html': 'html',
  '.htm': 'html',
  '.css': 'css',
  '.py': 'python',
}

// Infer language from filename extension
export function languageFromFilename(name) {
  const dot = name.lastIndexOf('.')
  if (dot === -1) return 'javascript'
  const ext = name.slice(dot).toLowerCase()
  return EXT_TO_LANGUAGE[ext] || 'javascript'
}

// Default starter code per language
export const DEFAULT_FILE_CODE = {
  javascript: `// Do not rename this function
function solution(/* params */) {
  // Your code here
}

exports.solution = solution;
`,
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>

  </body>
</html>
`,
  css: `/* Write your CSS here */

`,
  python: `def solution(params):
    # Your code here
    pass
`,
}

// Default lockedLines per language
export const DEFAULT_LOCKED_LINES = {
  javascript: 2,
  html: 0,
  css: 0,
  python: 0,
}

// Create a default file object for a given language
export function createDefaultFile(language, nameOverride = null) {
  return {
    name: nameOverride || DEFAULT_FILENAMES[language] || 'file.txt',
    language,
    code: DEFAULT_FILE_CODE[language] || '',
    lockedLines: DEFAULT_LOCKED_LINES[language] || 0,
  }
}

// Max files per challenge
export const MAX_FILES = 5
