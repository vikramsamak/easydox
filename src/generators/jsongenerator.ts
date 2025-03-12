import { ComponentInfo } from '../types';

export function jsonGenerator(components: ComponentInfo[]): string {
  return JSON.stringify(
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
}
