export const sampleChallenges = [
  {
    id: 'sample-css-flexbox',
    title: 'Center Content with Flexbox',
    language: 'css',
    difficulty: 'beginner',
    fixtureHtml: `<div class="wrapper">
  <div class="card">I'm centered!</div>
</div>`,
    description: `Use CSS Flexbox to center a card both **horizontally** and **vertically** inside its wrapper.

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
    difficulty: 'beginner',
    fixtureHtml: `<button class="btn">Click Me</button>`,
    description: `Turn a plain browser button into a polished, clickable UI element using CSS.

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
    difficulty: 'intermediate',
    fixtureHtml: `<div class="card">
  <h2 class="card-title">Card Title</h2>
  <p class="card-body">Some card content goes here. Cards are a staple of modern UI design.</p>
</div>`,
    description: `Cards are one of the most common UI patterns. Style the provided markup into a clean, elevated card.

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
    id: 'sample-css-grid',
    title: 'Three-Column Grid Layout',
    language: 'css',
    difficulty: 'intermediate',
    fixtureHtml: `<div class="grid-container">
  <div class="grid-item">One</div>
  <div class="grid-item">Two</div>
  <div class="grid-item">Three</div>
  <div class="grid-item">Four</div>
  <div class="grid-item">Five</div>
  <div class="grid-item">Six</div>
</div>`,
    description: `Use CSS Grid to lay out six items in a three-column grid with spacing between them.

### The HTML structure (provided for you)

\`\`\`html
<div class="grid-container">
  <div class="grid-item">One</div>
  ...
</div>
\`\`\`

### Requirements

1. \`.grid-container\` must use **CSS Grid** (\`display: grid\`)
2. The grid must have **exactly 3 columns** (e.g. \`repeat(3, 1fr)\`)
3. There must be a **gap of at least 8px** between items
4. \`.grid-item\` must have a **background color** (not transparent)
5. \`.grid-item\` must have **padding of at least 12px** on all sides

### Tips

- \`grid-template-columns: repeat(3, 1fr)\` creates 3 equal-width columns
- \`gap: 16px\` sets space between both rows and columns
- \`fr\` stands for "fraction of available space"
`,
    starterCode: `/* Style the grid container */
.grid-container {

}

/* Style each grid item */
.grid-item {

}
`,
    tests: [
      {
        id: 'sample-css-grid-t1',
        description: '.grid-container uses display: grid',
        assertion: `
          return getComputedStyle(container.querySelector('.grid-container')).display === 'grid';
        `,
        failureMessage: 'Set display: grid on .grid-container.',
      },
      {
        id: 'sample-css-grid-t2',
        description: '.grid-container has exactly 3 columns',
        assertion: `
          const cols = getComputedStyle(container.querySelector('.grid-container')).gridTemplateColumns;
          return cols.trim().split(/\s+/).length === 3;
        `,
        failureMessage: 'Set grid-template-columns to 3 columns, e.g. repeat(3, 1fr).',
      },
      {
        id: 'sample-css-grid-t3',
        description: '.grid-container has a gap of at least 8px',
        assertion: `
          const s = getComputedStyle(container.querySelector('.grid-container'));
          return parseFloat(s.gap) >= 8 || parseFloat(s.rowGap) >= 8 || parseFloat(s.columnGap) >= 8;
        `,
        failureMessage: 'Add a gap of at least 8px to .grid-container.',
      },
      {
        id: 'sample-css-grid-t4',
        description: '.grid-item has a background color',
        assertion: `
          const bg = getComputedStyle(container.querySelector('.grid-item')).backgroundColor;
          return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
        `,
        failureMessage: 'Add a background-color to .grid-item.',
      },
      {
        id: 'sample-css-grid-t5',
        description: '.grid-item has at least 12px padding on all sides',
        assertion: `
          const s = getComputedStyle(container.querySelector('.grid-item'));
          return parseFloat(s.paddingTop) >= 12 && parseFloat(s.paddingBottom) >= 12
            && parseFloat(s.paddingLeft) >= 12 && parseFloat(s.paddingRight) >= 12;
        `,
        failureMessage: 'Give .grid-item a padding of at least 12px on all sides.',
      },
    ],
  },
  {
    id: 'sample-css-variables',
    title: 'CSS Custom Properties Theme',
    language: 'css',
    difficulty: 'advanced',
    fixtureHtml: `<div class="themed">
  <h2 class="themed-heading">Themed Component</h2>
  <p class="themed-text">This card uses CSS custom properties for consistent theming.</p>
  <button class="themed-btn">Click Me</button>
</div>`,
    description: `Use CSS custom properties (variables) to build a consistently themed component. Define reusable values once on \`:root\` and reference them throughout your styles.

### The HTML structure (provided for you)

\`\`\`html
<div class="themed">
  <h2 class="themed-heading">Themed Component</h2>
  <p class="themed-text">...</p>
  <button class="themed-btn">Click Me</button>
</div>
\`\`\`

### Requirements

1. Define a \`--primary-color\` custom property on \`:root\`
2. Define a \`--text-color\` custom property on \`:root\`
3. Define a \`--border-radius\` custom property on \`:root\`
4. \`.themed-btn\` must have a **non-transparent background color** (set using \`var(--primary-color)\`)
5. \`.themed\` must have **rounded corners** (set using \`var(--border-radius)\`)

### Tips

- Custom properties start with \`--\`: \`--primary-color: #6366f1\`
- Use them with \`var()\`: \`background: var(--primary-color)\`
- Define them on \`:root\` so they are available anywhere in the document
`,
    starterCode: `/* Define your CSS custom properties */
:root {

}

/* Style the container */
.themed {

}

/* Style the button */
.themed-btn {

}
`,
    tests: [
      {
        id: 'sample-css-vars-t1',
        description: '--primary-color is defined on :root',
        assertion: `
          const root = container.ownerDocument.documentElement;
          return getComputedStyle(root).getPropertyValue('--primary-color').trim() !== '';
        `,
        failureMessage: 'Define --primary-color on :root, e.g. --primary-color: #6366f1',
      },
      {
        id: 'sample-css-vars-t2',
        description: '--text-color is defined on :root',
        assertion: `
          const root = container.ownerDocument.documentElement;
          return getComputedStyle(root).getPropertyValue('--text-color').trim() !== '';
        `,
        failureMessage: 'Define --text-color on :root, e.g. --text-color: #111827',
      },
      {
        id: 'sample-css-vars-t3',
        description: '--border-radius is defined on :root',
        assertion: `
          const root = container.ownerDocument.documentElement;
          return getComputedStyle(root).getPropertyValue('--border-radius').trim() !== '';
        `,
        failureMessage: 'Define --border-radius on :root, e.g. --border-radius: 8px',
      },
      {
        id: 'sample-css-vars-t4',
        description: '.themed-btn has a non-transparent background color',
        assertion: `
          const bg = getComputedStyle(container.querySelector('.themed-btn')).backgroundColor;
          return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
        `,
        failureMessage: 'Set a background-color on .themed-btn using var(--primary-color).',
      },
      {
        id: 'sample-css-vars-t5',
        description: '.themed has rounded corners (border-radius > 0)',
        assertion: `
          return parseFloat(getComputedStyle(container.querySelector('.themed')).borderRadius) > 0;
        `,
        failureMessage: 'Give .themed a border-radius using var(--border-radius).',
      },
    ],
  },
  {
    id: 'sample-css-inputs',
    title: 'Style Form Inputs',
    language: 'css',
    difficulty: 'advanced',
    fixtureHtml: `<form class="styled-form">
  <label class="field-label" for="name">Name</label>
  <input class="field-input" id="name" type="text" placeholder="Your name" />
  <label class="field-label" for="email">Email</label>
  <input class="field-input" id="email" type="email" placeholder="you@example.com" />
  <label class="field-label" for="msg">Message</label>
  <textarea class="field-input" id="msg" rows="3" placeholder="Your message"></textarea>
  <button class="field-btn" type="submit">Send</button>
</form>`,
    description: `Create a polished, consistent form design by styling its inputs, labels, and submit button.

### The HTML structure (provided for you)

\`\`\`html
<form class="styled-form">
  <label class="field-label" for="name">Name</label>
  <input class="field-input" id="name" type="text" ... />
  <label class="field-label" for="email">Email</label>
  <input class="field-input" id="email" type="email" ... />
  <label class="field-label" for="msg">Message</label>
  <textarea class="field-input" ...></textarea>
  <button class="field-btn" type="submit">Send</button>
</form>
\`\`\`

### Requirements

1. \`.styled-form\` must use **Flexbox with column direction** to stack fields vertically
2. \`.field-input\` must have a **visible border**
3. \`.field-input\` must have **rounded corners** (\`border-radius\` > 0)
4. \`.field-input\` must have **at least 8px padding** vertically and horizontally
5. \`.field-btn\` must have a **colored background** and **white text**
`,
    starterCode: `/* Stack the form fields vertically */
.styled-form {

}

/* Style labels */
.field-label {

}

/* Style inputs and textarea */
.field-input {

}

/* Style the submit button */
.field-btn {

}
`,
    tests: [
      {
        id: 'sample-css-inputs-t1',
        description: '.styled-form uses flexbox with column direction',
        assertion: `
          const s = getComputedStyle(container.querySelector('.styled-form'));
          return s.display === 'flex' && s.flexDirection === 'column';
        `,
        failureMessage: 'Set display: flex and flex-direction: column on .styled-form.',
      },
      {
        id: 'sample-css-inputs-t2',
        description: '.field-input has a visible border',
        assertion: `
          const s = getComputedStyle(container.querySelector('.field-input'));
          return s.borderTopStyle !== 'none' && parseFloat(s.borderTopWidth) > 0;
        `,
        failureMessage: 'Add a border to .field-input.',
      },
      {
        id: 'sample-css-inputs-t3',
        description: '.field-input has rounded corners (border-radius > 0)',
        assertion: `
          return parseFloat(getComputedStyle(container.querySelector('.field-input')).borderRadius) > 0;
        `,
        failureMessage: 'Add a border-radius greater than 0 to .field-input.',
      },
      {
        id: 'sample-css-inputs-t4',
        description: '.field-input has at least 8px padding on all sides',
        assertion: `
          const s = getComputedStyle(container.querySelector('.field-input'));
          return parseFloat(s.paddingTop) >= 8 && parseFloat(s.paddingLeft) >= 8;
        `,
        failureMessage: 'Give .field-input at least 8px of vertical and horizontal padding.',
      },
      {
        id: 'sample-css-inputs-t5',
        description: '.field-btn has a colored background and white text',
        assertion: `
          const s = getComputedStyle(container.querySelector('.field-btn'));
          const bg = s.backgroundColor;
          return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent'
            && s.color === 'rgb(255, 255, 255)';
        `,
        failureMessage: 'Give .field-btn a colored background and set color: white.',
      },
    ],
  },
  {
    id: 'sample-html-nav',
    title: 'Build a Navigation Bar',
    language: 'html',
    difficulty: 'beginner',
    description: `Create a semantic navigation bar using the correct HTML elements.

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
    difficulty: 'beginner',
    description: `Create a semantic HTML contact form that collects a user's name, email, and message.

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
    difficulty: 'intermediate',
    description: `Use semantic HTML5 elements to structure a blog post correctly. Semantic HTML improves accessibility and SEO by giving content meaningful structure.

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
    id: 'sample-html-table',
    title: 'Build a Data Table',
    language: 'html',
    difficulty: 'intermediate',
    description: `Create a semantic HTML table to display structured data. Well-formed tables use \`<thead>\`, \`<tbody>\`, \`<caption>\`, and header cells with a \`scope\` attribute for accessibility.

### Requirements

1. A \`<table>\` element
2. A \`<caption>\` providing a title for the table
3. A \`<thead>\` containing a row of \`<th>\` header cells
4. Each \`<th>\` in the header must have \`scope="col"\`
5. A \`<tbody>\` with at least **3 rows** of data (\`<td>\` cells)

### Expected structure

\`\`\`html
<table>
  <caption>Monthly Budget</caption>
  <thead>
    <tr>
      <th scope="col">Category</th>
      <th scope="col">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Rent</td><td>$1,200</td></tr>
    <tr><td>Food</td><td>$400</td></tr>
    <tr><td>Transport</td><td>$150</td></tr>
  </tbody>
</table>
\`\`\`

Use any subject you like — sales figures, a schedule, student grades, etc.
`,
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Data Table</title>
</head>
<body>

  <!-- Build your data table here -->

</body>
</html>
`,
    tests: [
      {
        id: 'sample-html-table-t1',
        description: 'Page contains a <table> element',
        assertion: 'return document.querySelector("table") !== null;',
        failureMessage: 'Add a <table> element to structure your data.',
      },
      {
        id: 'sample-html-table-t2',
        description: 'Table has a <caption>',
        assertion: 'return document.querySelector("table caption") !== null;',
        failureMessage: 'Add a <caption> inside your <table> to give it a descriptive title.',
      },
      {
        id: 'sample-html-table-t3',
        description: 'Table has a <thead> with at least one <th>',
        assertion: 'return document.querySelectorAll("thead th").length >= 1;',
        failureMessage: 'Add a <thead> with at least one <th> header cell.',
      },
      {
        id: 'sample-html-table-t4',
        description: 'Every <th> in the header has scope="col"',
        assertion: `
          const ths = [...document.querySelectorAll('thead th')];
          return ths.length > 0 && ths.every(th => th.getAttribute('scope') === 'col');
        `,
        failureMessage: 'Add scope="col" to every <th> in the <thead>.',
      },
      {
        id: 'sample-html-table-t5',
        description: '<tbody> has at least 3 data rows',
        assertion: 'return document.querySelectorAll("tbody tr").length >= 3;',
        failureMessage: 'Add at least 3 rows of data inside <tbody>.',
      },
    ],
  },
  {
    id: 'sample-html-accessible-form',
    title: 'Accessible Registration Form',
    language: 'html',
    difficulty: 'advanced',
    description: `Build an accessible user registration form using proper semantic HTML. Features like \`<fieldset>\`, \`<legend>\`, paired \`for\`/\`id\` attributes, and \`required\` make forms usable by everyone, including screen reader users.

### Requirements

1. A \`<fieldset>\` grouping the form fields with a \`<legend>\` title
2. An \`<input type="text">\` for a username with \`name="username"\` and \`required\`
3. An \`<input type="email">\` for email with \`name="email"\` and \`required\`
4. An \`<input type="password">\` for password with \`name="password"\` and \`minlength="8"\`
5. Every input must have an associated \`<label>\` using matching \`for\` and \`id\` attributes
6. A \`<button type="submit">\` to submit the form

### Expected structure

\`\`\`html
<form>
  <fieldset>
    <legend>Create your account</legend>
    <label for="username">Username</label>
    <input type="text" id="username" name="username" required />
    ...
  </fieldset>
  <button type="submit">Sign Up</button>
</form>
\`\`\`
`,
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Registration Form</title>
</head>
<body>

  <!-- Build your accessible registration form here -->

</body>
</html>
`,
    tests: [
      {
        id: 'sample-html-a11y-t1',
        description: 'Form contains a <fieldset> with a <legend>',
        assertion: 'return document.querySelector("fieldset legend") !== null;',
        failureMessage: 'Wrap your inputs in a <fieldset> and add a <legend> to name the group.',
      },
      {
        id: 'sample-html-a11y-t2',
        description: 'Username input is required and has a matching label',
        assertion: `
          const input = document.querySelector('input[name="username"][required]');
          if (!input || !input.id) return false;
          return document.querySelector('label[for="' + input.id + '"]') !== null;
        `,
        failureMessage: 'Add a required <input type="text" name="username" id="..."> with a <label for="..."> that matches its id.',
      },
      {
        id: 'sample-html-a11y-t3',
        description: 'Email input is required and has a matching label',
        assertion: `
          const input = document.querySelector('input[type="email"][name="email"][required]');
          if (!input || !input.id) return false;
          return document.querySelector('label[for="' + input.id + '"]') !== null;
        `,
        failureMessage: 'Add a required <input type="email" name="email" id="..."> with a matching <label for="...">.',
      },
      {
        id: 'sample-html-a11y-t4',
        description: 'Password input has minlength="8" and a matching label',
        assertion: `
          const input = document.querySelector('input[type="password"][name="password"]');
          if (!input || !input.id) return false;
          return parseInt(input.getAttribute('minlength')) >= 8
            && document.querySelector('label[for="' + input.id + '"]') !== null;
        `,
        failureMessage: 'Add <input type="password" name="password" minlength="8"> with a matching <label for="...">.',
      },
      {
        id: 'sample-html-a11y-t5',
        description: 'Form has a submit button',
        assertion: 'return document.querySelector(\'button[type="submit"]\') !== null;',
        failureMessage: 'Add a <button type="submit"> to the form.',
      },
    ],
  },
  {
    id: 'sample-html-figure',
    title: 'Figures, Captions & Semantic Media',
    language: 'html',
    difficulty: 'advanced',
    description: `Use semantic HTML5 elements to mark up a media-rich page. The \`<figure>\` and \`<figcaption>\` elements provide meaningful context for images, and elements like \`<address>\` and \`<time>\` add machine-readable metadata.

### Requirements

1. At least **2 \`<figure>\` elements**, each containing an \`<img>\` and a \`<figcaption>\`
2. Every \`<img>\` must have a **non-empty \`alt\` attribute**
3. A \`<section>\` element with an \`<h2>\` heading inside it
4. An \`<address>\` element containing author or contact information
5. A \`<time>\` element with a \`datetime\` attribute in \`YYYY-MM-DD\` format

### Expected structure

\`\`\`html
<section>
  <h2>Gallery</h2>
  <figure>
    <img src="photo.jpg" alt="A mountain landscape at sunset" />
    <figcaption>Sunset over the Rockies</figcaption>
  </figure>
  <figure>
    <img src="photo2.jpg" alt="An autumn forest trail" />
    <figcaption>Autumn trail, 2024</figcaption>
  </figure>
</section>
<address>By <a href="mailto:you@example.com">Author Name</a></address>
<time datetime="2025-06-01">June 1, 2025</time>
\`\`\`
`,
    starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Media Page</title>
</head>
<body>

  <!-- Build your semantic media page here -->

</body>
</html>
`,
    tests: [
      {
        id: 'sample-html-fig-t1',
        description: 'Page has at least 2 <figure> elements',
        assertion: 'return document.querySelectorAll("figure").length >= 2;',
        failureMessage: 'Add at least 2 <figure> elements to the page.',
      },
      {
        id: 'sample-html-fig-t2',
        description: 'Each <figure> has an <img> with a non-empty alt and a <figcaption>',
        assertion: `
          const figures = [...document.querySelectorAll('figure')];
          return figures.every(fig => {
            const img = fig.querySelector('img');
            const cap = fig.querySelector('figcaption');
            return img && img.getAttribute('alt')?.trim() !== '' && cap !== null;
          });
        `,
        failureMessage: 'Each <figure> must contain an <img alt="..."> with a non-empty alt and a <figcaption>.',
      },
      {
        id: 'sample-html-fig-t3',
        description: 'Page has a <section> containing an <h2>',
        assertion: 'return document.querySelector("section h2") !== null;',
        failureMessage: 'Add a <section> with an <h2> heading inside it.',
      },
      {
        id: 'sample-html-fig-t4',
        description: 'Page has an <address> element',
        assertion: 'return document.querySelector("address") !== null;',
        failureMessage: 'Add an <address> element with author or contact information.',
      },
      {
        id: 'sample-html-fig-t5',
        description: '<time> element has a valid datetime attribute (YYYY-MM-DD)',
        assertion: `
          const t = document.querySelector('time[datetime]');
          return t !== null && /^\d{4}-\d{2}-\d{2}/.test(t.getAttribute('datetime'));
        `,
        failureMessage: 'Add a <time datetime="YYYY-MM-DD"> element to mark a date.',
      },
    ],
  },
  {
    id: 'sample-py-reverse',
    title: 'Reverse a String',
    language: 'python',
    difficulty: 'beginner',
    description: `Write a function \`reverse_string\` that takes a string and returns it reversed.

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
    difficulty: 'beginner',
    description: `Write a function \`filter_even\` that takes a list of integers and returns a new list containing only the even numbers, in the same order.

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
    difficulty: 'intermediate',
    description: `Write a function \`char_count\` that takes a string and returns a dictionary mapping each character to the number of times it appears.

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
    id: 'sample-py-word-freq',
    title: 'Word Frequency Counter',
    language: 'python',
    difficulty: 'intermediate',
    description: `Write a function \`word_frequency\` that takes a sentence string and returns a dictionary mapping each word (lowercased) to the number of times it appears.

### Examples

\`\`\`python
word_frequency("the cat sat on the mat")
# → {"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}

word_frequency("Hello hello HELLO")  # → {"hello": 3}
word_frequency("")                    # → {}
\`\`\`

### Tips

- \`str.lower()\` converts to lowercase
- \`str.split()\` splits on whitespace
- Use \`dict.get(key, 0)\` to safely increment a count
`,
    starterCode: `def word_frequency(sentence):
    # Return a dict of word: count (case-insensitive)
    pass
`,
    tests: [
      {
        id: 'sample-py-wf-t1',
        description: 'word_frequency("the cat sat on the mat") returns correct counts',
        assertion: 'word_frequency("the cat sat on the mat") == {"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}',
        failureMessage: 'Expected word_frequency("the cat sat on the mat") to return the correct frequency dict.',
      },
      {
        id: 'sample-py-wf-t2',
        description: 'word_frequency is case-insensitive',
        assertion: 'word_frequency("Hello hello HELLO") == {"hello": 3}',
        failureMessage: 'Lowercase all words before counting — "Hello" and "hello" should be the same.',
      },
      {
        id: 'sample-py-wf-t3',
        description: 'word_frequency("") returns {}',
        assertion: 'word_frequency("") == {}',
        failureMessage: 'Expected word_frequency("") to return an empty dict.',
      },
      {
        id: 'sample-py-wf-t4',
        description: 'word_frequency("python") returns {"python": 1}',
        assertion: 'word_frequency("python") == {"python": 1}',
        failureMessage: 'Expected word_frequency("python") to return {"python": 1}.',
      },
      {
        id: 'sample-py-wf-t5',
        description: 'word_frequency counts multiple words correctly',
        assertion: 'word_frequency("one two two three three three") == {"one": 1, "two": 2, "three": 3}',
        failureMessage: 'Expected correct counts for "one two two three three three".',
      },
    ],
  },
  {
    id: 'sample-py-caesar',
    title: 'Caesar Cipher',
    language: 'python',
    difficulty: 'advanced',
    description: `Write a function \`caesar_cipher\` that takes a string and a shift amount (integer) and returns the string with each alphabetic character shifted that many positions. Non-alphabetic characters pass through unchanged.

### Examples

\`\`\`python
caesar_cipher("hello", 3)   # → "khoor"
caesar_cipher("xyz", 3)     # → "abc"   (wraps around)
caesar_cipher("Hello!", 3)  # → "Khoor!" (preserves case, keeps "!")
caesar_cipher("abc", -1)    # → "zab"   (negative shift)
\`\`\`

### Tips

- Use \`ord()\` and \`chr()\` to work with character codes
- Uppercase: A=65…Z=90, Lowercase: a=97…z=122
- \`(ord(c) - base + shift) % 26 + base\` handles wrapping for both directions
`,
    starterCode: `def caesar_cipher(text, shift):
    # Shift each letter by 'shift' positions, wrap around the alphabet
    pass
`,
    tests: [
      {
        id: 'sample-py-caesar-t1',
        description: 'caesar_cipher("hello", 3) returns "khoor"',
        assertion: 'caesar_cipher("hello", 3) == "khoor"',
        failureMessage: 'Expected caesar_cipher("hello", 3) to return "khoor".',
      },
      {
        id: 'sample-py-caesar-t2',
        description: 'Shift wraps around: caesar_cipher("xyz", 3) returns "abc"',
        assertion: 'caesar_cipher("xyz", 3) == "abc"',
        failureMessage: 'Expected caesar_cipher("xyz", 3) to return "abc" — make sure the shift wraps around.',
      },
      {
        id: 'sample-py-caesar-t3',
        description: 'Preserves case and non-letters: caesar_cipher("Hello!", 3) returns "Khoor!"',
        assertion: 'caesar_cipher("Hello!", 3) == "Khoor!"',
        failureMessage: 'Preserve the case of letters and leave non-alphabetic characters unchanged.',
      },
      {
        id: 'sample-py-caesar-t4',
        description: 'Negative shift: caesar_cipher("abc", -1) returns "zab"',
        assertion: 'caesar_cipher("abc", -1) == "zab"',
        failureMessage: 'Expected caesar_cipher("abc", -1) to return "zab".',
      },
      {
        id: 'sample-py-caesar-t5',
        description: 'caesar_cipher("", 5) returns ""',
        assertion: 'caesar_cipher("", 5) == ""',
        failureMessage: 'An empty string should return an empty string.',
      },
    ],
  },
  {
    id: 'sample-py-brackets',
    title: 'Balanced Brackets',
    language: 'python',
    difficulty: 'advanced',
    description: `Write a function \`is_balanced\` that returns \`True\` if every opening bracket in the string has a correctly matched closing bracket, \`False\` otherwise. Handle \`()\`, \`[]\`, and \`{}\`.

### Examples

\`\`\`python
is_balanced("()")        # → True
is_balanced("()[]{}")   # → True
is_balanced("{[()]}")   # → True  (correctly nested)
is_balanced("(]")       # → False
is_balanced("([)]")     # → False
is_balanced("{")        # → False  (unclosed)
\`\`\`

### Tips

- Use a **stack** (a Python list) — push opening brackets, pop when you see a closing bracket
- If a closing bracket doesn't match the top of the stack, return \`False\`
- At the end, the stack must be empty (no unclosed brackets)
`,
    starterCode: `def is_balanced(s):
    # Return True if all brackets are properly matched and nested
    pass
`,
    tests: [
      {
        id: 'sample-py-brackets-t1',
        description: 'is_balanced("()") returns True',
        assertion: 'is_balanced("()") == True',
        failureMessage: 'Expected is_balanced("()") to return True.',
      },
      {
        id: 'sample-py-brackets-t2',
        description: 'is_balanced("()[]{}") returns True',
        assertion: 'is_balanced("()[]{}") == True',
        failureMessage: 'Expected is_balanced("()[]{}") to return True — all pairs matched.',
      },
      {
        id: 'sample-py-brackets-t3',
        description: 'is_balanced("{[()]}") returns True (nested)',
        assertion: 'is_balanced("{[()]}") == True',
        failureMessage: 'Expected is_balanced("{[()]}") to return True — correctly nested brackets.',
      },
      {
        id: 'sample-py-brackets-t4',
        description: 'is_balanced("(]") returns False',
        assertion: 'is_balanced("(]") == False',
        failureMessage: 'Expected is_balanced("(]") to return False — mismatched bracket types.',
      },
      {
        id: 'sample-py-brackets-t5',
        description: 'is_balanced("{") returns False (unclosed)',
        assertion: 'is_balanced("{") == False',
        failureMessage: 'Expected is_balanced("{") to return False — unclosed bracket.',
      },
    ],
  },
  {
    id: 'sample-add',
    title: 'Sum Two Numbers',
    language: 'javascript',
    difficulty: 'beginner',
    description: `Write a function \`add\` that takes two numbers and returns their sum.

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
    starterCode: `// Do not rename this function
function add(a, b) {
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
    id: 'sample-js-max',
    title: 'Find the Maximum Value',
    language: 'javascript',
    difficulty: 'beginner',
    description: `Write a function \`findMax\` that takes an array of numbers and returns the largest value. Return \`null\` if the array is empty.

### Examples

\`\`\`js
findMax([3, 1, 4, 1, 5, 9])  // → 9
findMax([-3, -1, -4])         // → -1
findMax([42])                  // → 42
findMax([])                    // → null
\`\`\`

### Constraints

- The array will only contain numbers
- Do not use \`Math.max(...arr)\` — implement the logic with a loop
`,
    starterCode: `// Do not rename this function
function findMax(arr) {
  // Your code here
}

exports.findMax = findMax;
`,
    tests: [
      {
        id: 'sample-js-max-t1',
        description: 'findMax([3, 1, 4, 1, 5, 9]) returns 9',
        assertion: 'return exports.findMax([3, 1, 4, 1, 5, 9]) === 9;',
        failureMessage: 'Expected findMax([3, 1, 4, 1, 5, 9]) to return 9.',
      },
      {
        id: 'sample-js-max-t2',
        description: 'findMax([-3, -1, -4]) returns -1',
        assertion: 'return exports.findMax([-3, -1, -4]) === -1;',
        failureMessage: 'Expected findMax([-3, -1, -4]) to return -1.',
      },
      {
        id: 'sample-js-max-t3',
        description: 'findMax([42]) returns 42',
        assertion: 'return exports.findMax([42]) === 42;',
        failureMessage: 'Expected findMax([42]) to return 42.',
      },
      {
        id: 'sample-js-max-t4',
        description: 'findMax([]) returns null',
        assertion: 'return exports.findMax([]) === null;',
        failureMessage: 'Expected findMax([]) to return null for an empty array.',
      },
      {
        id: 'sample-js-max-t5',
        description: 'Does not use Math.max()',
        assertion: 'return !exports.findMax.toString().includes("Math.max(");',
        failureMessage: 'Solve the problem without using Math.max() — implement the logic with a loop.',
      },
    ],
  },
  {
    id: 'sample-palindrome',
    title: 'Palindrome Check',
    language: 'javascript',
    difficulty: 'intermediate',
    description: `Write a function \`isPalindrome\` that returns \`true\` if the given string reads the same forwards and backwards, \`false\` otherwise.

Ignore case when comparing — \`"Racecar"\` should return \`true\`.

### Examples

\`\`\`js
isPalindrome("racecar")  // → true
isPalindrome("hello")    // → false
isPalindrome("Madam")    // → true
isPalindrome("A")        // → true
\`\`\`
`,
    starterCode: `// Do not rename this function
function isPalindrome(str) {
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
    difficulty: 'intermediate',
    description: `Write a function \`fizzBuzz\` that takes a number \`n\` and returns an array of strings from 1 to n where:

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
    starterCode: `// Do not rename this function
function fizzBuzz(n) {
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
  {
    id: 'sample-js-flatten',
    title: 'Flatten a Nested Array',
    language: 'javascript',
    difficulty: 'advanced',
    description: `Write a function \`flatten\` that takes a deeply nested array and returns a new flat array containing all values in order. The input may be nested to any depth.

### Examples

\`\`\`js
flatten([1, [2, 3]])              // → [1, 2, 3]
flatten([1, [2, [3, [4]]]])       // → [1, 2, 3, 4]
flatten([[1, 2], [3, [4, 5]]])    // → [1, 2, 3, 4, 5]
flatten([])                        // → []
\`\`\`

### Constraints

- Do not use \`Array.prototype.flat()\` — implement the recursion yourself
- The array may be nested to arbitrary depth
`,
    starterCode: `// Do not rename this function
function flatten(arr) {
  // Your code here
}

exports.flatten = flatten;
`,
    tests: [
      {
        id: 'sample-js-flatten-t1',
        description: 'flatten([1, [2, 3]]) returns [1, 2, 3]',
        assertion: 'return JSON.stringify(exports.flatten([1, [2, 3]])) === JSON.stringify([1, 2, 3]);',
        failureMessage: 'Expected flatten([1, [2, 3]]) to return [1, 2, 3].',
      },
      {
        id: 'sample-js-flatten-t2',
        description: 'flatten handles deep nesting',
        assertion: 'return JSON.stringify(exports.flatten([1, [2, [3, [4]]]])) === JSON.stringify([1, 2, 3, 4]);',
        failureMessage: 'Expected flatten([1, [2, [3, [4]]]]) to return [1, 2, 3, 4].',
      },
      {
        id: 'sample-js-flatten-t3',
        description: 'flatten([[1, 2], [3, [4, 5]]]) returns [1, 2, 3, 4, 5]',
        assertion: 'return JSON.stringify(exports.flatten([[1, 2], [3, [4, 5]]])) === JSON.stringify([1, 2, 3, 4, 5]);',
        failureMessage: 'Expected flatten([[1, 2], [3, [4, 5]]]) to return [1, 2, 3, 4, 5].',
      },
      {
        id: 'sample-js-flatten-t4',
        description: 'flatten([]) returns []',
        assertion: 'return JSON.stringify(exports.flatten([])) === JSON.stringify([]);',
        failureMessage: 'Expected flatten([]) to return [].',
      },
      {
        id: 'sample-js-flatten-t5',
        description: 'flatten([1]) returns [1]',
        assertion: 'return JSON.stringify(exports.flatten([1])) === JSON.stringify([1]);',
        failureMessage: 'Expected flatten([1]) to return [1].',
      },
      {
        id: 'sample-js-flatten-t6',
        description: 'Does not use Array.prototype.flat()',
        assertion: 'return !exports.flatten.toString().includes(".flat(");',
        failureMessage: 'Solve this without using Array.prototype.flat() — implement the recursion yourself.',
      },
    ],
  },
  {
    id: 'sample-js-groupby',
    title: 'Group Array by Key',
    language: 'javascript',
    difficulty: 'advanced',
    description: `Write a function \`groupBy\` that takes an array of objects and a key name, and returns an object grouping the items by their value for that key.

### Examples

\`\`\`js
groupBy([
  { type: 'fruit', name: 'apple' },
  { type: 'veggie', name: 'carrot' },
  { type: 'fruit', name: 'banana' },
], 'type')
// → {
//     fruit: [{ type: 'fruit', name: 'apple' }, { type: 'fruit', name: 'banana' }],
//     veggie: [{ type: 'veggie', name: 'carrot' }]
//   }

groupBy([], 'type')  // → {}
\`\`\`

### Tips

- \`Array.prototype.reduce()\` is a clean one-pass solution
- Check if the key already exists in the accumulator before pushing
- Items within each group should stay in their original order
`,
    starterCode: `// Do not rename this function
function groupBy(arr, key) {
  // Your code here
}

exports.groupBy = groupBy;
`,
    tests: [
      {
        id: 'sample-js-groupby-t1',
        description: 'groupBy groups items by the given key',
        assertion: `
          const result = exports.groupBy([
            { type: 'fruit', name: 'apple' },
            { type: 'veggie', name: 'carrot' },
            { type: 'fruit', name: 'banana' },
          ], 'type');
          return result.fruit.length === 2 && result.veggie.length === 1;
        `,
        failureMessage: 'Expected groupBy to produce a fruit group (2 items) and a veggie group (1 item).',
      },
      {
        id: 'sample-js-groupby-t2',
        description: 'Items within each group preserve their original order',
        assertion: `
          const result = exports.groupBy([
            { type: 'fruit', name: 'apple' },
            { type: 'veggie', name: 'carrot' },
            { type: 'fruit', name: 'banana' },
          ], 'type');
          return result.fruit[0].name === 'apple' && result.fruit[1].name === 'banana';
        `,
        failureMessage: 'Items within each group should maintain their original array order.',
      },
      {
        id: 'sample-js-groupby-t3',
        description: 'groupBy([], "type") returns {}',
        assertion: `return JSON.stringify(exports.groupBy([], 'type')) === JSON.stringify({});`,
        failureMessage: 'Expected groupBy([], "type") to return {}.',
      },
      {
        id: 'sample-js-groupby-t4',
        description: 'groupBy works with numeric key values',
        assertion: `
          const result = exports.groupBy([
            { score: 1, name: 'a' },
            { score: 2, name: 'b' },
            { score: 1, name: 'c' },
          ], 'score');
          return result[1].length === 2 && result[2].length === 1;
        `,
        failureMessage: 'Expected groupBy to correctly handle numeric key values.',
      },
    ],
  },
]
