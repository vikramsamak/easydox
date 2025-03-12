import { ComponentInfo } from '../types';

export function markdownGenerator(components: ComponentInfo[]): string {
  let markdown = `# AutoDocs: Component Documentation\n\n`;

  components.forEach(({ componentName, props, jsDoc, code, fileExtension }) => {
    markdown += `## ${componentName}\n\n`;

    const componentDescription =
      jsDoc?.description?.trim() || 'No description available.';

    markdown += `${componentDescription}\n\n`;

    if (props.length > 0) {
      markdown += `### Props\n\n`;

      const propsMarkdown = props
        .map((prop) => {
          const propDoc = jsDoc?.tags?.find(
            (tag) => tag.title === 'param' && tag.description?.includes(prop)
          );
          const propDescription =
            propDoc?.description?.replace(`${prop} - `, '').trim() ||
            'No description';

          return `- **${prop}**: ${propDescription}`;
        })
        .join('\n');

      markdown += `${propsMarkdown}\n\n`;
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

  return markdown;
}
