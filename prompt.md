# Claude Code Project Prompt

## Challenge Authoring & Execution Platform Prototype

I want you to build a complete prototype web application.

This is a **Challenge Authoring & Execution Platform** for coding challenges.

---

## Tech Stack

- Vite
- React
- JavaScript (not TypeScript)
- TailwindCSS
- React Router
- CodeMirror for code editing
- Marked for markdown rendering
- uuid for IDs

No backend. Use **localStorage** for persistence.

---

## High-Level Requirements

The application must support:

1. Creating coding challenges (Admin)
2. Storing challenges in localStorage
3. Listing challenges
4. Running challenges (Student view)
5. Executing JavaScript code safely in the browser
6. Running defined tests and showing failure feedback

This prototype only needs to execute **JavaScript challenges**.

The architecture should allow future support for other languages.

---

## Application Pages

### 1. Challenge List Page (`/`)

- Displays all saved challenges
- Button: **Create New Challenge**
- Clicking a challenge navigates to `/challenge/:id`
- Edit button navigates to `/admin/:id`

---

### 2. Admin Page (`/admin` and `/admin/:id`)

Form fields:

- Title (text input)
- Language (dropdown, default: JavaScript)
- Task Description (textarea, supports markdown)
- Starter Code (CodeMirror editor)
- Tests (dynamic list)

Each test must include:

- Test Description
- Assertion (JavaScript code string that returns true/false)
- Failure Message

---

### Test Assertion Format Example

```js
return exports.add(1, 2) === 3;
```

Tests should:

- Run sequentially
- Stop at the first failure
- Display that test's failure message

Allow:

- Add Test
- Delete Test
- Save Challenge

Saving updates localStorage.

---

### 3. Student Challenge Page (`/challenge/:id`)

Layout:

#### Top Section

- Title
- Rendered Markdown Task

#### Main Section

Tabs:

- Code
- Console

##### Code Tab

- CodeMirror editor prefilled with starter code

##### Console Tab

Displays:

- Test results
- Error messages
- Success message

#### Bottom

- Submit button

---

## Code Execution Rules

When the user submits:

1. Wrap user code in a `new Function`
2. Require them to define functions/variables normally
3. Return an object called `exports` that contains any globally defined functions

### Example Wrapper Strategy

```js
const wrapped = new Function(`
${userCode}
return { add };
`);

const exports = wrapped();
```

Then run each test:

```js
const testFn = new Function("exports", test.assertion);
```

If:

- `testFn` returns `false` → show failure message
- It throws an error → show error
- All pass → show success

All execution must be wrapped in try/catch.

---

## Data Model

### Challenge Object

```js
{
  id: string,
  title: string,
  language: string,
  description: string,
  starterCode: string,
  tests: [
    {
      id: string,
      description: string,
      assertion: string,
      failureMessage: string
    }
  ]
}
```

---

## Architecture Requirements

- Clean folder structure
- Reusable components
- Custom hook for localStorage persistence
- Execution engine isolated in its own file
- Clear separation between:
  - UI
  - State
  - Execution logic

---

## UI Requirements

- Tailwind styling
- Clean, modern interface
- Responsive layout
- Clear pass/fail indicators
- Minimal but polished

---

## Bonus (If Time Permits)

- Duplicate challenge
- Delete challenge
- Dark mode toggle
- Export challenges as JSON file
- Import challenges from JSON

---

## Final Instruction

Build the full working app structure.

Show:

- All files
- File contents
- Clear folder structure
- How to run locally
- Any setup steps required

This should be a fully functioning, polished prototype.
