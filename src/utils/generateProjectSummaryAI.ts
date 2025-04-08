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
          content: `You are a technical writer. Given a list of modules or components, generate a clean and simple project summary strictly in plain Markdown.
        
        - Start with a short project description (do not use a heading for this)
        - Then include a section titled "## Key Features" and list key features in bullet points
        - Do not add any top-level heading like "## Project Name" or "## Utility Functions Library"
        - Do not include code fences like \`\`\`markdown
        - Do not include suggestions, extra commentary, or metadata
        - The output must only be valid Markdown — suitable for inclusion in a README file`,
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
