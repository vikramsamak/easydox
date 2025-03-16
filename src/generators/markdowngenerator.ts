import { ComponentInfo } from '../types';
import { markdownTable } from 'markdown-table';
import { generateMarkdownHeader, toTitleCase } from '../utils';
import prettier from 'prettier';

export async function markdownGenerator(
  components: ComponentInfo[]
): Promise<string> {
  let markdown = `${generateMarkdownHeader()}\n\n`;

  components.forEach(({ componentName, props, jsDoc, code, fileExtension }) => {
    markdown += `## ${toTitleCase(componentName)}\n\n`;

    const componentDescription =
      jsDoc?.description?.trim() || 'No description available.';
    markdown += `${componentDescription}\n\n`;

    // Props table
    if (props.length > 0) {
      markdown += `### Props\n\n`;

      const tableData = [['Name', 'Type', 'Description']];
      props.forEach((prop) => {
        const paramTag = jsDoc?.tags.find(
          (tag) => tag.title === 'param' && tag.name === prop
        );

        const propType = paramTag?.type || 'unknown';
        const propDescription = paramTag?.description?.trim() || 'No description';

        tableData.push([`**${prop}**`, `\`${propType}\``, propDescription]);
      });

      markdown += markdownTable(tableData, { align: ['l', 'c', 'l'] }) + '\n\n';
    }

    // @returns
    const returnsTag = jsDoc?.tags.find((tag) => tag.title === 'returns');
    if (returnsTag) {
      markdown += `### Returns\n\n`;
      markdown += `- Type: \`${returnsTag.type || 'unknown'}\`\n`;
      markdown += `- Description: ${returnsTag.description || 'No description'}\n\n`;
    }

    // @deprecated
    const deprecatedTag = jsDoc?.tags.find((tag) => tag.title === 'deprecated');
    if (deprecatedTag) {
      markdown += `### ⚠️ Deprecated\n\n`;
      markdown += `> ${deprecatedTag.description || 'No details provided.'}\n\n`;
    }

    // @throws
    const throwsTags = jsDoc?.tags.filter((tag) => tag.title === 'throws') || [];
    if (throwsTags.length > 0) {
      markdown += `### Throws\n\n`;
      throwsTags.forEach((tag) => {
        markdown += `- \`${tag.type || 'Error'}\`: ${
          tag.description || 'No description'
        }\n`;
      });
      markdown += `\n`;
    }

    // @see
    const seeTags = jsDoc?.tags.filter((tag) => tag.title === 'see') || [];
    if (seeTags.length > 0) {
      markdown += `### See Also\n\n`;
      seeTags.forEach((tag) => {
        markdown += `- ${tag.description || tag.name || 'Reference'}\n`;
      });
      markdown += `\n`;
    }

    // @example
    const exampleTags = jsDoc?.tags.filter((tag) => tag.title === 'example') || [];
    if (exampleTags.length > 0) {
      markdown += `### Examples\n\n`;
      exampleTags.forEach((tag) => {
        markdown += `\`\`\`js\n${tag.description || 'No example'}\n\`\`\`\n\n`;
      });
    }

    // Code snippet
    if (code) {
      const language =
        fileExtension === '.tsx'
          ? 'tsx'
          : fileExtension === '.ts'
          ? 'ts'
          : 'js';

      markdown += `### Code Example\n\n`;
      markdown += `\`\`\`${language}\n${code.trim()}\n\`\`\`\n\n`;
    }

    markdown += `---\n\n`;
  });

  return prettier.format(markdown, { parser: 'markdown' });
}
