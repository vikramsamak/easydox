import { genericSections } from '../constants/genericsections';
import { ComponentInfo } from '../types';
import { generateComponentDocsAI } from '../utils/generateComponentDocsAI';
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

  const enrichedComponents = await Promise.all(
    components.map(async (component) => {
      const needsAIJSDoc =
        !component.jsDoc?.description &&
        (!component.jsDoc?.tags || component.jsDoc.tags.length === 0);

      let tags = component.jsDoc?.tags || [];
      let description = component.jsDoc?.description || '';

      if (needsAIJSDoc && component.code) {
        const aiGenerated = await generateComponentDocsAI({
          componentName: component.componentName,
          code: component.code,
        });
        tags = aiGenerated?.tags || [];
        description = aiGenerated?.description || '';
      }

      const enrichedProps = (component.props || []).map((prop) => {
        const paramTag = tags.find(
          (tag) => tag.title === 'param' && tag.name === prop
        );
        return {
          name: prop,
          type: paramTag?.type || 'unknown',
          description: paramTag?.description?.trim() || 'No description',
        };
      });

      const extraSections = genericSections
        .map((section) => {
          const matchedTags =
            tags.filter((tag) => tag.title === section.tag) || [];
          return {
            title: section.title,
            content: matchedTags.map((tag) => section.render(tag)),
          };
        })
        .filter((section) => section.content.length > 0);

      return {
        ...component,
        description,
        props: enrichedProps,
        extraSections,
      };
    })
  );

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
