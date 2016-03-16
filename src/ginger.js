import { RuleHelper } from 'textlint-rule-helper';
import gingerbread from 'gingerbread';
import promisify from 'es6-promisify';

const gingerbreadAsync = promisify(gingerbread);

function reporter(context) {
  const {
    Syntax,
    getSource,
    report,
    RuleError,
    fixer,
  } = context;
  const helper = new RuleHelper(context);

  return {
    [Syntax.Paragraph](node) {
      if (helper.isChildNode(node, [Syntax.BlockQuote])) {
        return null;
      }

      return (async () => {
        const text = getSource(node);
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
          const range = [index, index + correction.length];
          const message = `${correction.text} -> ${correction.correct}`;
          const fix = fixer.replaceTextRange(range, correction.correct);

          report(node, new RuleError(message, { index, fix }));
        });
      })();
    },
  };
}

export default {
  linter: reporter,
  fixer: reporter,
};
