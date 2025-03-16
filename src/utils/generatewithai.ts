import { openai } from '../lib/openaiconfig';

export async function generateWithAI(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'mistral-7b-instruct',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
  });

  const completion = response.choices[0]?.message?.content?.trim() || '';
  return completion;
}
