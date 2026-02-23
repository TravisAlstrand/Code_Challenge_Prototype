export const sampleChallenges = [
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
