import { RuleHelper, IgnoreNodeManager } from 'textlint-rule-helper';
import gingerbread from 'gingerbread';
import promisify from 'es6-promisify';
import StringSource from 'textlint-util-to-string';

const ignoreNodeManager = new IgnoreNodeManager();
const gingerbreadAsync = promisify(gingerbread, { multiArgs: true });

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
  if (
    helper.isChildNode(node, [
      Syntax.Link,
      Syntax.Image,
      Syntax.BlockQuote,
      Syntax.Emphasis,
    ])
  ) {
    return null;
  }

  // ignore Code type node
  ignoreNodeManager.ignoreChildrenByTypes(node, [Syntax.Code]);

  const source = new StringSource(node);
  const text = source.toString();

  return { source, text };
}

function reporter(context, options = {}) {
  const opts = Object.assign({ skipRegExps: [] }, options);
  const { Syntax, report, RuleError, fixer } = context;

  return {
    [Syntax.Paragraph](node) {
      return (async () => {
        const { source, text } = filterNode({ node, context }) || {};

        if (!source || !text) {
          return;
        }

        const [original, gingered, corrections] = await gingerbreadAsync(text);

        // when no errors.
        if (original === gingered) {
          return;
        }

        corrections
          .filter(
            (correction) =>
              !opts.skipRegExps.some((skipRegExp) =>
                RegExp(skipRegExp).test(correction.text),
              ),
          )
          .forEach((correction) => {
            const index = correction.start;
            const originalPosition = source.originalPositionFromIndex(index);
            const originalRange = [
              originalPosition.column,
              originalPosition.column + correction.length,
            ];

            // if range is ignored, skip reporting
            if (ignoreNodeManager.isIgnoredRange(originalRange)) {
              return;
            }

            const fix = fixer.replaceTextRange(
              originalRange,
              correction.correct,
            );
            const message = `${correction.text} -> ${correction.correct}`;

            report(
              node,
              new RuleError(message, {
                line: originalPosition.line - 1,
                column: originalPosition.column,
                fix,
              }),
            );
          });
      })();
    },
  };
}

export default {
  linter: reporter,
  fixer: reporter,
};
