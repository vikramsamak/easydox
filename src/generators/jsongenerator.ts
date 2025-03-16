import { genericSections } from '../constants/genericSections';
import { ComponentInfo } from '../types';
import prettier from 'prettier';

export async function jsonGenerator(
  components: ComponentInfo[]
): Promise<string> {
  const allExtensions = Array.from(
    new Set(components.map((c) => c.fileExtension))
  );

  const allComponentNames = components.map((c) => c.componentName);

  const allTags = new Set<string>();
  components.forEach((comp) => {
    comp.jsDoc?.tags?.forEach((tag) => {
      allTags.add(tag.title);
    });
  });

  const enrichedComponents = components.map((component) => {
    const extraSections = genericSections.map((section) => {
      const matchedTags = component.jsDoc?.tags.filter(
        (tag) => tag.title === section.tag
      ) || [];

      return {
        title: section.title,
        content: matchedTags.map((tag) => section.render(tag)),
      };
    }).filter(section => section.content.length > 0);

    return {
      ...component,
      extraSections,
    };
  });

  const rawJson = JSON.stringify(
    {
      metadata: {
        generatedAt: new Date().toISOString(),
        componentCount: components.length,
        fileExtensions: allExtensions,
        componentNames: allComponentNames,
        tagsUsed: Array.from(allTags),
      },
      components: enrichedComponents,
    },
    null,
    2
  );

  return prettier.format(rawJson, { parser: 'json' });
}
