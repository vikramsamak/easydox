import { openai } from '../lib/openaiconfig';
import { ComponentInfo } from '../types';

export async function generateProjectSummaryAI(
  components: ComponentInfo[]
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        {
          role: 'system',
          content: `You are a technical writer summarizing a UI component library. Provide a project-wide summary or overview for the given components.`,
        },
        {
          role: 'user',
          content: `Here are the components:
            ${JSON.stringify(
              components.map((c) => c.componentName),
              null,
              2
            )}
            `,
        },
      ],
    });

    return response.choices[0]?.message?.content || '';
  } catch (err) {
    console.error('AI Project Summary Error:', err);
    return '';
  }
}
