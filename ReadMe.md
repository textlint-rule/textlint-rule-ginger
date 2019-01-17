# textlint-rule-ginger

[![textlint rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/)
[![npm](https://img.shields.io/npm/v/textlint-rule-ginger.svg)](https://www.npmjs.com/package/textlint-rule-ginger)
[![Build Status](https://travis-ci.org/textlint-rule/textlint-rule-ginger.svg?branch=master)](https://travis-ci.org/textlint-rule/textlint-rule-ginger)
[![Dependency Status](https://david-dm.org/textlint-rule/textlint-rule-ginger.svg)](https://david-dm.org/textlint-rule/textlint-rule-ginger)
[![devDependency Status](https://david-dm.org/textlint-rule/textlint-rule-ginger/dev-status.svg)](https://david-dm.org/textlint-rule/textlint-rule-ginger#info=devDependencies)

[textlint](https://github.com/textlint/textlint) rule
to check your English grammar with [Ginger Proofreading](http://www.gingersoftware.com/proofreading).

## Installation

```
$ npm install textlint-rule-ginger
```

## Usage

```
$ npm install textlint textlint-rule-ginger
$ textlint --rule textlint-rule-ginger text-to-proofread.txt
```

## Options

* `skipPatterns`: `string[]`
  * Set skip pattern that is detecting by [@textlint/regexp-string-matcher](https://github.com/textlint/regexp-string-matcher)

You can set regexp-like string as skip patterns.
For more details about regexp-like string, see [@textlint/regexp-string-matcher](https://github.com/textlint/regexp-string-matcher)

```json
{
    "rule": {
      "ginger": {
        "skipPatterns": ["/JavaScript/i"]
      }
    }
}
```

## Tests

```
npm test
```

## Contribution

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT License (http://nodaguti.mit-license.org/)
