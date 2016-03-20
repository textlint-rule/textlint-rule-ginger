import rule from '../src/ginger';
import TextlintTester from 'textlint-tester';

const tester = new TextlintTester();

tester.run('ginger', rule, {
  valid: [
    'Hello, world!',
    'This sentence contains no mistakes.',
    'This link contains an [errror](index.html) but it should be ignored.',
    'Misspellings in inline `codee` should be ignored.',
  ],
  invalid: [
    {
      text: 'The smelt of fliwers bring back memories.',
      output: 'The smell of flowers brings back memories.',
      errors: [
        {
          message: 'smelt -> smell',
          line: 1,
          column: 5,
        },
        {
          message: 'fliwers -> flowers',
          line: 1,
          column: 14,
        },
        {
          message: 'bring -> brings',
          line: 1,
          column: 22,
        },
      ],
    },
    {
      text: 'This sentence contains `code` and an errror.',
      output: 'This sentence contains `code` and an error.',
      errors: [
        {
          message: 'errror -> error',
          line: 1,
          column: 38,
        },
      ],
    },
  ],
});
