# ⚡ CodeChallenge Platform

A browser-based **coding challenge authoring and execution platform** built as a prototype. Admins can create interactive coding challenges with test suites; students can solve them directly in the browser with instant feedback — no backend required.

---

## Features

- **Challenge authoring** — rich admin form with a live CodeMirror editor, markdown task descriptions, and a dynamic test builder
- **In-browser code execution** — JavaScript submissions run safely using `new Function`, with results displayed per-test
- **Stop-at-first-failure** — tests run sequentially and halt on the first failing assertion, surfacing a clear failure message
- **Persistent storage** — all challenges are saved to `localStorage` and survive page refreshes
- **Sample challenges** — three seeded challenges (Sum Two Numbers, Palindrome Check, FizzBuzz) are loaded on first visit
- **Duplicate & delete** — manage your challenge library from the list page
- **Export / Import JSON** — share challenge sets as portable `.json` files
- **Dark mode** — system-aware toggle with full dark theme support
- **Markdown rendering** — task descriptions support full GitHub-flavoured Markdown

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build tool | [Vite](https://vitejs.dev/) |
| UI | [React 18](https://react.dev/) |
| Routing | [React Router v6](https://reactrouter.com/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) |
| Code editor | [CodeMirror 6](https://codemirror.net/) via [@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror) |
| Markdown | [marked](https://marked.js.org/) |
| IDs | [uuid](https://github.com/uuidjs/uuid) |
| Persistence | `localStorage` (no backend) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

### Install & run

```bash
# Clone or download the project
cd Code-Challenge-Prototype

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Other scripts

```bash
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
```

---

## Project Structure

```
src/
├── App.jsx                      # Root component with router setup
├── main.jsx                     # React entry point
├── index.css                    # Tailwind directives + global overrides
│
├── context/
│   └── ThemeContext.jsx          # Dark mode state and toggle
│
├── data/
│   └── sampleChallenges.js      # Seeded challenges loaded on first visit
│
├── engine/
│   └── executor.js              # Isolated JS execution engine (no UI deps)
│
├── hooks/
│   ├── useLocalStorage.js       # Generic localStorage ↔ React state sync
│   └── useChallenges.js         # Challenge CRUD, duplicate, import/export
│
├── components/
│   ├── Layout.jsx               # Nav bar and page shell
│   ├── ChallengeCard.jsx        # List item card with hover actions
│   ├── CodeEditor.jsx           # CodeMirror wrapper (theme-aware)
│   ├── TestItem.jsx             # Single test row in the admin form
│   ├── MarkdownRenderer.jsx     # Renders markdown to styled HTML
│   └── ConsoleOutput.jsx        # Pass/fail results display
│
└── pages/
    ├── ChallengeList.jsx        # / — browse and manage challenges
    ├── AdminPage.jsx            # /admin, /admin/:id — create and edit
    └── StudentChallenge.jsx     # /challenge/:id — solve a challenge
```

---

## How Code Execution Works

All code runs entirely in the browser — there is no server involved.

### 1. User code is sandboxed in a `Function`

When a student submits, their code is wrapped in a `new Function` that receives a single `exports` object. This gives students a familiar way to expose their work:

```js
// Student writes this in the editor:
function add(a, b) {
  return a + b;
}

exports.add = add;
```

Internally, the engine does:

```js
const exports = {}
const userFn = new Function('exports', studentCode)
userFn(exports)
// exports.add is now available
```

### 2. Tests receive the same `exports`

Each test assertion is also wrapped in a `new Function` that receives the populated `exports` object:

```js
const testFn = new Function('exports', 'return exports.add(1, 2) === 3;')
const passed = testFn(exports) // true or false
```

### 3. Sequential execution, stop at first failure

Tests run in order. The moment one returns `false` or throws, execution halts and that test's failure message is shown. Passing tests are displayed as they complete.

### 4. All paths are try/caught

Both the user code execution and each individual test assertion are wrapped in `try/catch`, so syntax errors, runtime errors, and assertion errors are all surfaced cleanly rather than crashing the app.

---

## Data Model

Each challenge stored in `localStorage` follows this shape:

```js
{
  id: string,           // UUID
  title: string,
  language: string,     // "javascript" (others reserved for future use)
  description: string,  // Raw markdown
  starterCode: string,  // Prefilled editor content
  tests: [
    {
      id: string,
      description: string,    // Shown in the test list
      assertion: string,      // JS code string — receives `exports`, must return boolean
      failureMessage: string  // Shown when the assertion returns false
    }
  ]
}
```

---

## Writing Challenges

### Starter code

Expose functions via the `exports` object so tests can access them:

```js
function multiply(a, b) {
  // student implements this
}

exports.multiply = multiply;
```

### Test assertions

Assertions are JavaScript code strings. They receive `exports` and must `return true` or `return false`:

```js
return exports.multiply(3, 4) === 12;
```

Multiple statements are supported:

```js
const result = exports.multiply(3, 4);
return typeof result === 'number' && result === 12;
```

---

## Roadmap / Future Considerations

- [ ] Python execution (via Pyodide or a WebAssembly runtime)
- [ ] `console.log` capture and display in the console tab
- [ ] Challenge categories and difficulty tags
- [ ] Student progress tracking
- [ ] Timed challenge mode
- [ ] Authentication and multi-user support (requires a backend)

---

## License

MIT
