import { openai } from '../lib/openaiconfig';
import { JsDoc } from '../types';
import { logMessage } from './logger';

interface GenerateDocsParams {
  componentName: string;
  code: string;
  props?: string[];
}

export async function generateComponentDocsAI({
  componentName,
  code,
  props = [],
}: GenerateDocsParams): Promise<Partial<JsDoc>> {
  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1:free',
      messages: [
        {
          role: 'system',
          content: `You are an expert technical writer. Given a component, output a COMPLETE JSDoc representation as JSON. Format:
  {
                      "description": "string",
                      "tags": [
                        {
                          "title": "param" | "returns",
                          "name"?: "string",
                          "type": "string",
                          "description": "string"
                        }
                      ]
                    }

                  Strictly follow the JSON structure. DO NOT add markdown or extra text.`,
        },
        {
          role: 'user',
          content: `Component Name: ${componentName}
Props: ${props.join(', ') || 'N/A'}
Code: \n${code}`,
        },
      ],
    });

    const aiContent = response.choices[0]?.message?.content || '';

    const jsonStart = aiContent.indexOf('{');
    const jsonEnd = aiContent.lastIndexOf('}');
    const jsonString = aiContent.substring(jsonStart, jsonEnd + 1);

    const jsDoc: Partial<JsDoc> = JSON.parse(jsonString);

    return jsDoc;
  } catch (err) {
    logMessage('Something went wrong while generating component docs', 'red');
    return {};
  }
}
