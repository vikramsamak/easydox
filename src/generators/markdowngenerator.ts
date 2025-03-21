import { ComponentInfo } from '../types';
import { markdownTable } from 'markdown-table';
import {
  generateMarkdownHeader,
  toTitleCase,
  validateAndFormatMarkdown,
} from '../utils';
import { genericSections } from '../constants/genericsections';
import { generateProjectSummaryAI } from '../utils/generateProjectSummaryAI';
import { generateComponentDocsAI } from '../utils/generateComponentDocsAI';

export async function markdownGenerator(
  components: ComponentInfo[]
): Promise<string> {
  let markdown = `${generateMarkdownHeader()}\n\n`;

  const projectSummary = await generateProjectSummaryAI(components);
  if (projectSummary) {
    markdown += `${projectSummary}\n\n`;
  }

  for (const {
    componentName,
    props,
    jsDoc,
    code,
    fileExtension,
  } of components) {
    markdown += `## ${toTitleCase(componentName)}\n\n`;

    const needsAIJSDoc =
      !jsDoc?.description && (!jsDoc?.tags || jsDoc.tags.length === 0);

    let componentDescription = jsDoc?.description?.trim() || '';
    let tags = jsDoc?.tags || [];

    // Fallback to AI
    if (needsAIJSDoc && code) {
      const aiGenerated = await generateComponentDocsAI({
        componentName,
        code,
        props,
      });
      componentDescription = aiGenerated?.description || '';
      tags = aiGenerated?.tags || [];
    }

    markdown += `${componentDescription || 'No description available.'}\n\n`;

    // Props Table
    if (props.length > 0) {
      markdown += `### Props\n\n`;
      const tableData = [['Name', 'Type', 'Description']];
      props.forEach((prop) => {
        const paramTag = tags.find(
          (tag) => tag.title === 'param' && tag.name === prop
        );
        const propType = paramTag?.type || 'unknown';
        const propDescription =
          paramTag?.description?.trim() || 'No description';
        tableData.push([`**${prop}**`, `\`${propType}\``, propDescription]);
      });
      markdown += markdownTable(tableData, { align: ['l', 'c', 'l'] }) + `\n\n`;
    }

    // Generic Sections (e.g., @returns, @example)
    genericSections.forEach(({ title, tag, multi, render }) => {
      const sectionTags = tags.filter((t) => t.title === tag);
      if (sectionTags.length > 0) {
        markdown += `### ${title}\n\n`;
        sectionTags.forEach((t) => {
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
  }

  return await validateAndFormatMarkdown(markdown);
}
