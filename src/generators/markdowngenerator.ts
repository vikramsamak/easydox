import { ComponentInfo } from '../types';
import { markdownTable } from 'markdown-table';
import { generateMarkdownHeader, toTitleCase } from '../utils';
import { genericSections } from '../constants/genericSections';
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

    // Props table from @param tags
    if (props.length > 0) {
      markdown += `### Props\n\n`;
      const tableData = [['Name', 'Type', 'Description']];
      props.forEach((prop) => {
        const paramTag = jsDoc?.tags.find(
          (tag) => tag.title === 'param' && tag.name === prop
        );
        const propType = paramTag?.type || 'unknown';
        const propDescription =
          paramTag?.description?.trim() || 'No description';
        tableData.push([`**${prop}**`, `\`${propType}\``, propDescription]);
      });
      markdown += markdownTable(tableData, { align: ['l', 'c', 'l'] }) + '\n\n';
    }

    genericSections.forEach(({ title, tag, multi, render }) => {
      const tags = jsDoc?.tags.filter((t) => t.title === tag) || [];
      if (tags.length > 0) {
        markdown += `### ${title}\n\n`;
        tags.forEach((t) => {
          markdown += render(t);
        });
        if (!multi) markdown += `\n`;
      }
    });

    // Code block
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
