import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkLint from 'remark-lint';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkLintHeadingIncrement from 'remark-lint-heading-increment';
import remarkNormalizeHeadings from 'remark-normalize-headings';

export async function validateAndFormatMarkdown(
  markdown: string
): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkLint)
    .use(remarkPresetLintRecommended)
    .use(remarkPresetLintConsistent)
    .use(remarkPresetLintMarkdownStyleGuide)
    .use(remarkLintHeadingIncrement)
    .use(remarkNormalizeHeadings)
    .use(remarkFrontmatter, ['yaml', 'toml'])
    .use(remarkGfm)
    .use(remarkStringify, {
      bullet: '-',
      fences: true,
      rule: '-',
      emphasis: '*',
      listItemIndent: 'one',
    })
    .process(markdown);

  return String(file);
}
