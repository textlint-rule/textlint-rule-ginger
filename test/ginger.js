import rule from '../src/ginger';
import TextlintTester from 'textlint-tester';

const tester = new TextlintTester();

tester.run('ginger', rule, {
  valid: [
    'Hello, world!',
    'This sentence contains no mistakes.',
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
  ],
});
