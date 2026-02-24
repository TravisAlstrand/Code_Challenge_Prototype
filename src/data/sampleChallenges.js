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
    id: 'sample-css-button',
    title: 'Style a Button',
    language: 'css',
    fixtureHtml: `<button class="btn">Click Me</button>`,
    description: `## Style a Button

Turn a plain browser button into a polished, clickable UI element using CSS.

### The HTML structure (provided for you)

\`\`\`html
<button class="btn">Click Me</button>
\`\`\`

### Requirements

1. \`.btn\` must have a **colored background** (not transparent)
2. The button **text must be white** (\`color: white\`)
3. \`.btn\` must have **rounded corners** (\`border-radius\` greater than 0)
4. The cursor must change to a **pointer** on hover (\`cursor: pointer\`)
5. \`.btn\` must have **vertical padding** of at least \`8px\` top and bottom

### Tips

- \`background-color\` sets the fill — pick any colour you like
- \`color: white\` sets the text colour
- \`border-radius: 6px\` (or more) gives rounded corners
- \`cursor: pointer\` signals the element is clickable
- \`padding: 8px 16px\` adds breathing room inside the button
`,
    starterCode: `/* Style the button */
.btn {

}
`,
    tests: [
      {
        id: 'sample-css-btn-t1',
        description: '.btn has a colored background (not transparent)',
        assertion: `
          const bg = getComputedStyle(container.querySelector('.btn')).backgroundColor;
          return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
        `,
        failureMessage: 'Add a background-color to .btn — any colour works.',
      },
      {
        id: 'sample-css-btn-t2',
        description: '.btn text is white (color: white)',
        assertion: `
          return getComputedStyle(container.querySelector('.btn')).color === 'rgb(255, 255, 255)';
        `,
        failureMessage: 'Set color: white on .btn so the text is readable.',
      },
      {
        id: 'sample-css-btn-t3',
        description: '.btn has rounded corners (border-radius > 0)',
        assertion: `
          const br = getComputedStyle(container.querySelector('.btn')).borderRadius;
          return parseFloat(br) > 0;
        `,
        failureMessage: 'Add a border-radius greater than 0 to give .btn rounded corners.',
      },
      {
        id: 'sample-css-btn-t4',
        description: '.btn has cursor: pointer',
        assertion: `
          return getComputedStyle(container.querySelector('.btn')).cursor === 'pointer';
        `,
        failureMessage: 'Add cursor: pointer to .btn so it signals it\'s clickable.',
      },
      {
        id: 'sample-css-btn-t5',
        description: '.btn has at least 8px vertical padding',
        assertion: `
          const s = getComputedStyle(container.querySelector('.btn'));
          return parseFloat(s.paddingTop) >= 8 && parseFloat(s.paddingBottom) >= 8;
        `,
        failureMessage: 'Give .btn a padding-top and padding-bottom of at least 8px.',
      },
    ],
  },
  {
    id: 'sample-css-card',
    title: 'Build a Card Component',
    language: 'css',
    fixtureHtml: `<div class="card">
  <h2 class="card-title">Card Title</h2>
  <p class="card-body">Some card content goes here. Cards are a staple of modern UI design.</p>
</div>`,
    description: `## Build a Card Component

Cards are one of the most common UI patterns. Style the provided markup into a clean, elevated card.

### The HTML structure (provided for you)

\`\`\`html
<div class="card">
  <h2 class="card-title">Card Title</h2>
  <p class="card-body">Some card content goes here.</p>
</div>
\`\`\`

### Requirements

1. \`.card\` must have a **background color** (not transparent)
2. \`.card\` must have **rounded corners** (\`border-radius\` greater than 0)
3. \`.card\` must have a **box shadow** (not \`none\`)
4. \`.card\` must have **padding of at least 16px** on all sides
5. \`.card-title\` font size must be **larger** than \`.card-body\` font size

### Tips

- \`background-color: white\` gives the card a clean surface
- \`box-shadow: 0 2px 8px rgba(0,0,0,0.1)\` is a classic subtle shadow
- \`font-size\` accepts values like \`px\`, \`rem\`, or \`em\`
`,
    starterCode: `/* Style the card container */
.card {

}

/* Style the title */
.card-title {

}

/* Style the body text */
.card-body {

}
`,
    tests: [
      {
        id: 'sample-css-card-t1',
        description: '.card has a background color (not transparent)',
        assertion: `
          const bg = getComputedStyle(container.querySelector('.card')).backgroundColor;
          return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
        `,
        failureMessage: 'Add a background-color to .card.',
      },
      {
        id: 'sample-css-card-t2',
        description: '.card has rounded corners (border-radius > 0)',
        assertion: `
          return parseFloat(getComputedStyle(container.querySelector('.card')).borderRadius) > 0;
        `,
        failureMessage: 'Add a border-radius greater than 0 to .card.',
      },
      {
        id: 'sample-css-card-t3',
        description: '.card has a box-shadow',
        assertion: `
          return getComputedStyle(container.querySelector('.card')).boxShadow !== 'none';
        `,
        failureMessage: 'Add a box-shadow to .card to give it depth.',
      },
      {
        id: 'sample-css-card-t4',
        description: '.card has at least 16px padding on all sides',
        assertion: `
          const s = getComputedStyle(container.querySelector('.card'));
          return parseFloat(s.paddingTop) >= 16
            && parseFloat(s.paddingRight) >= 16
            && parseFloat(s.paddingBottom) >= 16
            && parseFloat(s.paddingLeft) >= 16;
        `,
        failureMessage: 'Give .card a padding of at least 16px on all sides.',
      },
      {
        id: 'sample-css-card-t5',
        description: '.card-title font size is larger than .card-body font size',
        assertion: `
          const titleSize = parseFloat(getComputedStyle(container.querySelector('.card-title')).fontSize);
          const bodySize  = parseFloat(getComputedStyle(container.querySelector('.card-body')).fontSize);
          return titleSize > bodySize;
        `,
        failureMessage: 'Make .card-title have a larger font-size than .card-body.',
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
    id: 'sample-html-form',
    title: 'Build a Contact Form',
    language: 'html',
    description: `## Build a Contact Form

Create a semantic HTML contact form that collects a user's name, email, and message.

### Requirements

Your HTML must include:

1. A \`<form>\` element wrapping all inputs
2. An \`<input>\` with \`type="text"\` and \`name="name"\` for the user's name
3. An \`<input>\` with \`type="email"\` and \`name="email"\` for the email address
4. A \`<textarea>\` with \`name="message"\` for the message body
5. A \`<button>\` with \`type="submit"\` to submit the form

### Expected structure

\`\`\`html
<form>
  <label for="name">Name</label>
  <input type="text" id="name" name="name" />

  <label for="email">Email</label>
  <input type="email" id="email" name="email" />

  <label for="message">Message</label>
  <textarea id="message" name="message"></textarea>

  <button type="submit">Send</button>
</form>
\`\`\`

Feel free to add labels, placeholders, fieldsets, or styling — as long as all required elements are present.
`,
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Contact Form</title>
</head>
<body>

  <!-- Build your contact form here -->

</body>
</html>
`,
    tests: [
      {
        id: 'sample-html-form-t1',
        description: 'Page contains a <form> element',
        assertion: 'return document.querySelector("form") !== null;',
        failureMessage: 'Could not find a <form> element. Wrap your inputs in a <form> tag.',
      },
      {
        id: 'sample-html-form-t2',
        description: 'Form contains a text input with name="name"',
        assertion: 'return document.querySelector(\'input[type="text"][name="name"]\') !== null;',
        failureMessage: 'Add an <input type="text" name="name"> for the user\'s name.',
      },
      {
        id: 'sample-html-form-t3',
        description: 'Form contains an email input with name="email"',
        assertion: 'return document.querySelector(\'input[type="email"][name="email"]\') !== null;',
        failureMessage: 'Add an <input type="email" name="email"> for the email address.',
      },
      {
        id: 'sample-html-form-t4',
        description: 'Form contains a <textarea> with name="message"',
        assertion: 'return document.querySelector(\'textarea[name="message"]\') !== null;',
        failureMessage: 'Add a <textarea name="message"> for the message body.',
      },
      {
        id: 'sample-html-form-t5',
        description: 'Form contains a submit button',
        assertion: 'return document.querySelector(\'button[type="submit"]\') !== null || document.querySelector(\'input[type="submit"]\') !== null;',
        failureMessage: 'Add a <button type="submit"> or <input type="submit"> to allow form submission.',
      },
    ],
  },
  {
    id: 'sample-html-article',
    title: 'Semantic Blog Post',
    language: 'html',
    description: `## Semantic Blog Post

Use semantic HTML5 elements to structure a blog post correctly. Semantic HTML improves accessibility and SEO by giving content meaningful structure.

### Requirements

Your HTML must include:

1. An \`<article>\` element as the top-level wrapper for the post
2. A \`<header>\` inside the article containing an \`<h1>\` with the post title
3. At least one \`<p>\` (paragraph) of body text inside the article
4. A \`<footer>\` inside the article (e.g. for author or date info)
5. A \`<time>\` element somewhere in the document with a \`datetime\` attribute

### Expected structure

\`\`\`html
<article>
  <header>
    <h1>My Blog Post Title</h1>
  </header>

  <p>Some interesting content goes here...</p>

  <footer>
    <p>Published by <strong>Author Name</strong> on
      <time datetime="2025-01-01">January 1, 2025</time>
    </p>
  </footer>
</article>
\`\`\`

Feel free to add more content, sections, or styling — just keep the required elements in place.
`,
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Blog Post</title>
</head>
<body>

  <!-- Build your semantic blog post here -->

</body>
</html>
`,
    tests: [
      {
        id: 'sample-html-article-t1',
        description: 'Page contains an <article> element',
        assertion: 'return document.querySelector("article") !== null;',
        failureMessage: 'Wrap your blog post in an <article> element.',
      },
      {
        id: 'sample-html-article-t2',
        description: '<article> contains a <header> with an <h1>',
        assertion: 'return document.querySelector("article header h1") !== null;',
        failureMessage: 'Add a <header> inside your <article> that contains an <h1> for the post title.',
      },
      {
        id: 'sample-html-article-t3',
        description: '<article> contains at least one paragraph',
        assertion: 'return document.querySelector("article p") !== null;',
        failureMessage: 'Add at least one <p> paragraph of content inside your <article>.',
      },
      {
        id: 'sample-html-article-t4',
        description: '<article> contains a <footer>',
        assertion: 'return document.querySelector("article footer") !== null;',
        failureMessage: 'Add a <footer> inside your <article> for author or date information.',
      },
      {
        id: 'sample-html-article-t5',
        description: 'Page contains a <time> element with a datetime attribute',
        assertion: `
          const t = document.querySelector('time[datetime]');
          return t !== null && t.getAttribute('datetime').length > 0;
        `,
        failureMessage: 'Add a <time datetime="YYYY-MM-DD"> element to mark when the post was published.',
      },
    ],
  },
  {
    id: 'sample-py-reverse',
    title: 'Reverse a String',
    language: 'python',
    description: `## Reverse a String

Write a function \`reverse_string\` that takes a string and returns it reversed.

### Examples

\`\`\`python
reverse_string("hello")   # → "olleh"
reverse_string("Python")  # → "nohtyP"
reverse_string("")        # → ""
reverse_string("a")       # → "a"
\`\`\`

### Tips

- Python strings support slicing: \`s[::-1]\` returns the string reversed
- You can also use \`"".join(reversed(s))\`
`,
    starterCode: `def reverse_string(s):
    # Your code here
    pass
`,
    tests: [
      {
        id: 'sample-py-reverse-t1',
        description: 'reverse_string("hello") returns "olleh"',
        assertion: 'reverse_string("hello") == "olleh"',
        failureMessage: 'Expected reverse_string("hello") to return "olleh".',
      },
      {
        id: 'sample-py-reverse-t2',
        description: 'reverse_string("Python") returns "nohtyP"',
        assertion: 'reverse_string("Python") == "nohtyP"',
        failureMessage: 'Expected reverse_string("Python") to return "nohtyP".',
      },
      {
        id: 'sample-py-reverse-t3',
        description: 'reverse_string("") returns ""',
        assertion: 'reverse_string("") == ""',
        failureMessage: 'Expected reverse_string("") to return an empty string.',
      },
      {
        id: 'sample-py-reverse-t4',
        description: 'reverse_string("a") returns "a"',
        assertion: 'reverse_string("a") == "a"',
        failureMessage: 'A single character reversed is itself.',
      },
      {
        id: 'sample-py-reverse-t5',
        description: 'reverse_string("racecar") returns "racecar"',
        assertion: 'reverse_string("racecar") == "racecar"',
        failureMessage: 'Expected reverse_string("racecar") to return "racecar" (it\'s a palindrome).',
      },
    ],
  },
  {
    id: 'sample-py-filter-even',
    title: 'Filter Even Numbers',
    language: 'python',
    description: `## Filter Even Numbers

Write a function \`filter_even\` that takes a list of integers and returns a new list containing only the even numbers, in the same order.

### Examples

\`\`\`python
filter_even([1, 2, 3, 4, 5])  # → [2, 4]
filter_even([1, 3, 5])        # → []
filter_even([2, 4, 6])        # → [2, 4, 6]
filter_even([])               # → []
\`\`\`

### Tips

- A number is even if \`n % 2 == 0\`
- List comprehensions make this concise: \`[x for x in numbers if x % 2 == 0]\`
- \`0\` is considered even
`,
    starterCode: `def filter_even(numbers):
    # Return a list of only the even numbers
    pass
`,
    tests: [
      {
        id: 'sample-py-filter-t1',
        description: 'filter_even([1, 2, 3, 4, 5]) returns [2, 4]',
        assertion: 'filter_even([1, 2, 3, 4, 5]) == [2, 4]',
        failureMessage: 'Expected filter_even([1, 2, 3, 4, 5]) to return [2, 4].',
      },
      {
        id: 'sample-py-filter-t2',
        description: 'filter_even([1, 3, 5]) returns []',
        assertion: 'filter_even([1, 3, 5]) == []',
        failureMessage: 'Expected filter_even([1, 3, 5]) to return [] — no even numbers.',
      },
      {
        id: 'sample-py-filter-t3',
        description: 'filter_even([2, 4, 6]) returns [2, 4, 6]',
        assertion: 'filter_even([2, 4, 6]) == [2, 4, 6]',
        failureMessage: 'Expected filter_even([2, 4, 6]) to return [2, 4, 6].',
      },
      {
        id: 'sample-py-filter-t4',
        description: 'filter_even([]) returns []',
        assertion: 'filter_even([]) == []',
        failureMessage: 'Expected filter_even([]) to return [] for an empty list.',
      },
      {
        id: 'sample-py-filter-t5',
        description: 'filter_even([0, -2, 7]) returns [0, -2]',
        assertion: 'filter_even([0, -2, 7]) == [0, -2]',
        failureMessage: 'Remember: 0 and negative even numbers count too.',
      },
    ],
  },
  {
    id: 'sample-py-char-count',
    title: 'Count Character Occurrences',
    language: 'python',
    description: `## Count Character Occurrences

Write a function \`char_count\` that takes a string and returns a dictionary mapping each character to the number of times it appears.

### Examples

\`\`\`python
char_count("hello")   # → {"h": 1, "e": 1, "l": 2, "o": 1}
char_count("")        # → {}
char_count("aaa")     # → {"a": 3}
\`\`\`

### Tips

- Loop over the string and build a dict manually, or use \`dict.get(key, 0)\`
- \`collections.Counter\` does this in one line if you want a challenge!
- Every character (including spaces) should be counted
`,
    starterCode: `def char_count(s):
    # Return a dict mapping each character to its count
    pass
`,
    tests: [
      {
        id: 'sample-py-char-t1',
        description: 'char_count("hello") returns correct counts',
        assertion: 'char_count("hello") == {"h": 1, "e": 1, "l": 2, "o": 1}',
        failureMessage: 'Expected char_count("hello") to return {"h": 1, "e": 1, "l": 2, "o": 1}.',
      },
      {
        id: 'sample-py-char-t2',
        description: 'char_count("") returns {}',
        assertion: 'char_count("") == {}',
        failureMessage: 'Expected char_count("") to return an empty dict.',
      },
      {
        id: 'sample-py-char-t3',
        description: 'char_count("aaa") returns {"a": 3}',
        assertion: 'char_count("aaa") == {"a": 3}',
        failureMessage: 'Expected char_count("aaa") to return {"a": 3}.',
      },
      {
        id: 'sample-py-char-t4',
        description: 'char_count("ab") returns {"a": 1, "b": 1}',
        assertion: 'char_count("ab") == {"a": 1, "b": 1}',
        failureMessage: 'Expected char_count("ab") to return {"a": 1, "b": 1}.',
      },
      {
        id: 'sample-py-char-t5',
        description: 'char_count("abcabc") returns {"a": 2, "b": 2, "c": 2}',
        assertion: 'char_count("abcabc") == {"a": 2, "b": 2, "c": 2}',
        failureMessage: 'Expected char_count("abcabc") to return {"a": 2, "b": 2, "c": 2}.',
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
