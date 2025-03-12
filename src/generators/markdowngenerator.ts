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

    if (props.length > 0) {
      markdown += `### Props\n\n`;

      const tableData = [['Name', 'Type', 'Description']];

      props.forEach((prop) => {
        const propDoc = jsDoc?.tags?.find(
          (tag) => tag.title === 'param' && tag.name === prop
        );

        const propType = propDoc?.type || 'unknown';
        const propDescription =
          propDoc?.description?.trim() || 'No description';

        tableData.push([`**${prop}**`, `\`${propType}\``, propDescription]);
      });

      markdown += markdownTable(tableData, { align: ['l', 'c', 'l'] }) + '\n\n';
    }

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
