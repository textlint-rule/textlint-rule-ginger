import { RuleHelper } from 'textlint-rule-helper';
import gingerbread from 'gingerbread';
import promisify from 'es6-promisify';
import StringSource from 'textlint-util-to-string';
import map from 'unist-util-map';

const gingerbreadAsync = promisify(gingerbread);

/**
 * Exclude inappropriate parts of text from linting,
 * such as link texts, image captions, blockquotes, emphasized texts and inline code.
 * @param {TxtNode} node
 * @param {TextLintContext} context
 * @return {{ source: StringSource, text: string }}
 */
function filterNode({ node, context }) {
  const { Syntax } = context;
  const helper = new RuleHelper(context);

  if (helper.isChildNode(node, [
    Syntax.Link,
    Syntax.Image,
    Syntax.BlockQuote,
    Syntax.Emphasis,
  ])) {
    return null;
  }

  const filteredNode = map(node, (n) => {
    // Replace the value of inline code with a dummy text.
    if (n.type === Syntax.Code) {
      return Object.assign({}, n, { value: 'code' });
    }
    return n;
  });

  const source = new StringSource(filteredNode);
  const text = source.toString();

  return { source, text };
}

function reporter(context) {
  const {
    Syntax,
    report,
    RuleError,
    fixer,
  } = context;

  return {
    [Syntax.Paragraph](node) {
      return (async () => {
        const { source, text } = filterNode({ node, context }) || {};

        if (!source || !text) {
          return;
        }

        const [
          original,
          gingered,
          corrections,
        ] = await gingerbreadAsync(text);

        // when no errors.
        if (original === gingered) {
          return;
        }

        corrections.forEach((correction) => {
          const index = correction.start;
          const originalPosition = source.originalPositionFromIndex(index);
          const originalRange = [
            originalPosition.column,
            originalPosition.column + correction.length,
          ];
          const fix = fixer.replaceTextRange(originalRange, correction.correct);
          const message = `${correction.text} -> ${correction.correct}`;

          report(node, new RuleError(message, {
            line: originalPosition.line - 1,
            column: originalPosition.column,
            fix,
          }));
        });
      })();
    },
  };
}

export default {
  linter: reporter,
  fixer: reporter,
};
