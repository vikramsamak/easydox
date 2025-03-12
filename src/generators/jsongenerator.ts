import { ComponentInfo } from '../types';
import prettier from 'prettier';

export async function jsonGenerator(
  components: ComponentInfo[]
): Promise<string> {
  const rawJson = JSON.stringify(
    {
      metadata: {
        generatedAt: new Date().toISOString(),
        componentCount: components.length,
      },
      components,
    },
    null,
    2
  );

  return prettier.format(rawJson, { parser: 'json' });
}
