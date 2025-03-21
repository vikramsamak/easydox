import { openai } from '../lib/openaiconfig';
import { ComponentInfo } from '../types';

export async function generateComponentDocsAI(
  component: ComponentInfo
): Promise<ComponentInfo & { extraSections?: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        {
          role: 'system',
          content: `You are a technical writer helping document UI components. Provide additional sections such as "Usage Example" or "Best Practices" for this component: ${component.componentName}`,
        },
        {
          role: 'user',
          content: `Component Details:
          ${JSON.stringify(component, null, 2)}
          `,
        },
      ],
    });

    const aiContent = response.choices[0]?.message?.content || '';

    return {
      ...component,
      extraSections: aiContent
        ? `## AI Generated Insights\n\n${aiContent}\n\n`
        : '',
    };
  } catch (err) {
    console.error('AI Component Docs Error:', err);
    return { ...component };
  }
}
