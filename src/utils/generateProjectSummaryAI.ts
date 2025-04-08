import { openai } from '../lib/openaiconfig';
import { ComponentInfo } from '../types';
import { logMessage } from './logger';

export async function generateProjectSummaryAI(
  components: ComponentInfo[]
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1:free',
      messages: [
        {
          role: 'system',
          content: `You are a technical writer. Based on the provided modules or files, create a project-wide summary strictly in Markdown format.
                    The summary must include:
                    - A general description of the project based on the modules/files
                    - Key highlights or features in bullet points
                    - Any additional insights, suggestions, or notes.`,
        },
        {
          role: 'user',
          content: `Here are the detected modules/files with their full structure:
          ${JSON.stringify(components, null, 2)}
          `,
        },
      ],
    });

    return response.choices[0]?.message?.content || '';
  } catch (err) {
    logMessage('Something went wrong while generating project summary', 'red');
    return '';
  }
}
