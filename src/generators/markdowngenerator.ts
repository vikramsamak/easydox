import { ComponentInfo } from '../types';

export function markdownGenerator(components: ComponentInfo[]): string {
  let markdown = `# AutoDocs: Component Documentation\n\n`;

  components.forEach(({ componentName, props, jsDoc }) => {
    markdown += `## ${componentName}\n\n`;

    // Handle case where jsDoc is null or has no description
    const componentDescription =
      jsDoc?.description?.trim() || 'No description available.';
    markdown += `${componentDescription}\n\n`;

    if (props.length > 0) {
      markdown += `### Props\n\n`;
      props.forEach((prop) => {
        // Find the corresponding @param tag and ensure it has a valid description
        const propDoc = jsDoc?.tags?.find(
          (tag) => tag.title === 'param' && tag.description?.includes(prop)
        );

        const propDescription = propDoc?.description
          ? propDoc.description.replace(`${prop} - `, '').trim()
          : 'No description';

        markdown += `- **${prop}**: ${propDescription}\n`;
      });
      markdown += `\n`;
    }

    markdown += `---\n\n`;
  });

  return markdown;
}
