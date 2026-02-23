export const sampleChallenges = [
  {
    id: 'sample-css-flexbox',
    title: 'Center Content with Flexbox',
    language: 'css',
    fixtureHtml: `<div class="wrapper">
  <div class="card">I'm centered!</div>
</div>`,
    description: `## Center Content with Flexbox

Use CSS Flexbox to center a card both **horizontally** and **vertically** inside its wrapper.

### The HTML structure (provided for you)

\`\`\`html
<div class="wrapper">
  <div class="card">I'm centered!</div>
</div>
\`\`\`

### Requirements

1. \`.wrapper\` must use **Flexbox** as its display mode
2. Content must be centered **horizontally** (\`justify-content\`)
3. Content must be centered **vertically** (\`align-items\`)
4. \`.wrapper\` must have a \`min-height\` of at least **200px** so vertical centering is visible
5. \`.card\` must have a \`border-radius\` greater than 0 (rounded corners)

### Tips

- \`display: flex\` on the wrapper enables Flexbox
- \`justify-content: center\` centers children on the **main axis** (horizontal by default)
- \`align-items: center\` centers children on the **cross axis** (vertical by default)
- Computed colors are always in \`rgb()\` format — \`color: red\` computes to \`rgb(255, 0, 0)\`
`,
    starterCode: `/* Style the wrapper to center its child */
.wrapper {

}

/* Style the card however you like */
.card {

}
`,
    tests: [
      {
        id: 'sample-css-flex-t1',
        description: '.wrapper uses display: flex',
        assertion: `
          const wrapper = container.querySelector('.wrapper');
          return getComputedStyle(wrapper).display === 'flex';
        `,
        failureMessage: 'Set display: flex on .wrapper to enable Flexbox.',
      },
      {
        id: 'sample-css-flex-t2',
        description: '.wrapper centers content horizontally (justify-content: center)',
        assertion: `
          const wrapper = container.querySelector('.wrapper');
          return getComputedStyle(wrapper).justifyContent === 'center';
        `,
        failureMessage: 'Add justify-content: center to .wrapper to center horizontally.',
      },
      {
        id: 'sample-css-flex-t3',
        description: '.wrapper centers content vertically (align-items: center)',
        assertion: `
          const wrapper = container.querySelector('.wrapper');
          return getComputedStyle(wrapper).alignItems === 'center';
        `,
        failureMessage: 'Add align-items: center to .wrapper to center vertically.',
      },
      {
        id: 'sample-css-flex-t4',
        description: '.wrapper has a min-height of at least 200px',
        assertion: `
          const wrapper = container.querySelector('.wrapper');
          return parseInt(getComputedStyle(wrapper).minHeight) >= 200;
        `,
        failureMessage: 'Give .wrapper a min-height of at least 200px so vertical centering is visible.',
      },
      {
        id: 'sample-css-flex-t5',
        description: '.card has rounded corners (border-radius > 0)',
        assertion: `
          const card = container.querySelector('.card');
          const br = getComputedStyle(card).borderRadius;
          return br !== '0px' && br !== '0';
        `,
        failureMessage: 'Add a border-radius greater than 0 to .card to give it rounded corners.',
      },
    ],
  },
  {
    id: 'sample-html-nav',
    title: 'Build a Navigation Bar',
    language: 'html',
    description: `## Build a Navigation Bar

Create a semantic navigation bar using the correct HTML elements.

### Requirements

Your HTML must include:

1. A \`<nav>\` element as the outer wrapper
2. Inside it, an unordered list (\`<ul>\`) containing **at least 3** list items (\`<li>\`)
3. Each \`<li>\` must contain an \`<a>\` (anchor) link
4. One of the links must point to \`#home\`, one to \`#about\`, and one to \`#contact\`

### Expected structure

\`\`\`html
<nav>
  <ul>
    <li><a href="#home">Home</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>
\`\`\`

Feel free to add extra links, styling attributes, or additional content — as long as the above structure is present.
`,
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Navigation Bar</title>
</head>
<body>

  <!-- Build your navigation bar here -->

</body>
</html>
`,
    tests: [
      {
        id: 'sample-html-nav-t1',
        description: 'Page contains a <nav> element',
        assertion: 'return document.querySelector("nav") !== null;',
        failureMessage: 'Could not find a <nav> element. Wrap your navigation in a <nav> tag.',
      },
      {
        id: 'sample-html-nav-t2',
        description: '<nav> contains an unordered list <ul>',
        assertion: 'return document.querySelector("nav ul") !== null;',
        failureMessage: 'Could not find a <ul> inside your <nav>. Use an unordered list to group your links.',
      },
      {
        id: 'sample-html-nav-t3',
        description: 'Navigation has at least 3 list items',
        assertion: 'return document.querySelectorAll("nav ul li").length >= 3;',
        failureMessage: 'Found fewer than 3 <li> items inside your <nav><ul>. Add at least 3 list items.',
      },
      {
        id: 'sample-html-nav-t4',
        description: 'Each list item contains an <a> link',
        assertion: `
          const items = document.querySelectorAll("nav ul li");
          return [...items].every(li => li.querySelector("a") !== null);
        `,
        failureMessage: 'Every <li> must contain an <a> anchor element.',
      },
      {
        id: 'sample-html-nav-t5',
        description: 'Links include #home, #about, and #contact hrefs',
        assertion: `
          const hrefs = [...document.querySelectorAll("nav a")].map(a => a.getAttribute("href"));
          return hrefs.includes("#home") && hrefs.includes("#about") && hrefs.includes("#contact");
        `,
        failureMessage: 'Make sure you have links with href="#home", href="#about", and href="#contact".',
      },
    ],
  },
  {
    id: 'sample-add',
    title: 'Sum Two Numbers',
    language: 'javascript',
    description: `## Sum Two Numbers

Write a function \`add\` that takes two numbers and returns their sum.

### Examples

\`\`\`js
add(1, 2)   // → 3
add(-1, 1)  // → 0
add(0, 0)   // → 0
\`\`\`

### Constraints

- Inputs will always be finite numbers
- No need to handle non-numeric inputs
`,
    starterCode: `function add(a, b) {
  // Your code here
}

exports.add = add;
`,
    tests: [
      {
        id: 'sample-add-t1',
        description: 'add(1, 2) should return 3',
        assertion: 'return exports.add(1, 2) === 3;',
        failureMessage: 'Expected add(1, 2) to equal 3',
      },
      {
        id: 'sample-add-t2',
        description: 'add(-1, 1) should return 0',
        assertion: 'return exports.add(-1, 1) === 0;',
        failureMessage: 'Expected add(-1, 1) to equal 0',
      },
      {
        id: 'sample-add-t3',
        description: 'add(0, 0) should return 0',
        assertion: 'return exports.add(0, 0) === 0;',
        failureMessage: 'Expected add(0, 0) to equal 0',
      },
    ],
  },
  {
    id: 'sample-palindrome',
    title: 'Palindrome Check',
    language: 'javascript',
    description: `## Palindrome Check

Write a function \`isPalindrome\` that returns \`true\` if the given string reads the same forwards and backwards, \`false\` otherwise.

Ignore case when comparing — \`"Racecar"\` should return \`true\`.

### Examples

\`\`\`js
isPalindrome("racecar")  // → true
isPalindrome("hello")    // → false
isPalindrome("Madam")    // → true
isPalindrome("A")        // → true
\`\`\`
`,
    starterCode: `function isPalindrome(str) {
  // Your code here
}

exports.isPalindrome = isPalindrome;
`,
    tests: [
      {
        id: 'sample-pal-t1',
        description: '"racecar" is a palindrome',
        assertion: 'return exports.isPalindrome("racecar") === true;',
        failureMessage: 'Expected isPalindrome("racecar") to return true',
      },
      {
        id: 'sample-pal-t2',
        description: '"hello" is not a palindrome',
        assertion: 'return exports.isPalindrome("hello") === false;',
        failureMessage: 'Expected isPalindrome("hello") to return false',
      },
      {
        id: 'sample-pal-t3',
        description: '"Madam" is a palindrome (case-insensitive)',
        assertion: 'return exports.isPalindrome("Madam") === true;',
        failureMessage: 'Expected isPalindrome("Madam") to return true (case-insensitive)',
      },
      {
        id: 'sample-pal-t4',
        description: 'Single character is always a palindrome',
        assertion: 'return exports.isPalindrome("A") === true;',
        failureMessage: 'Expected isPalindrome("A") to return true',
      },
    ],
  },
  {
    id: 'sample-fizzbuzz',
    title: 'FizzBuzz',
    language: 'javascript',
    description: `## FizzBuzz

Write a function \`fizzBuzz\` that takes a number \`n\` and returns an array of strings from 1 to n where:

- Multiples of **3** → \`"Fizz"\`
- Multiples of **5** → \`"Buzz"\`
- Multiples of **both 3 and 5** → \`"FizzBuzz"\`
- Everything else → the number as a string

### Example

\`\`\`js
fizzBuzz(5) // → ["1", "2", "Fizz", "4", "Buzz"]
fizzBuzz(15) // → ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
\`\`\`
`,
    starterCode: `function fizzBuzz(n) {
  // Your code here
}

exports.fizzBuzz = fizzBuzz;
`,
    tests: [
      {
        id: 'sample-fizz-t1',
        description: 'fizzBuzz(1) returns ["1"]',
        assertion: 'return JSON.stringify(exports.fizzBuzz(1)) === JSON.stringify(["1"]);',
        failureMessage: 'Expected fizzBuzz(1) to return ["1"]',
      },
      {
        id: 'sample-fizz-t2',
        description: 'fizzBuzz(5) ends with "Buzz"',
        assertion: 'const r = exports.fizzBuzz(5); return r[4] === "Buzz";',
        failureMessage: 'Expected fizzBuzz(5)[4] to be "Buzz"',
      },
      {
        id: 'sample-fizz-t3',
        description: 'fizzBuzz(15) ends with "FizzBuzz"',
        assertion: 'const r = exports.fizzBuzz(15); return r[14] === "FizzBuzz";',
        failureMessage: 'Expected fizzBuzz(15)[14] to be "FizzBuzz"',
      },
      {
        id: 'sample-fizz-t4',
        description: 'fizzBuzz(3) includes "Fizz" at index 2',
        assertion: 'const r = exports.fizzBuzz(3); return r[2] === "Fizz";',
        failureMessage: 'Expected fizzBuzz(3)[2] to be "Fizz"',
      },
    ],
  },
]
