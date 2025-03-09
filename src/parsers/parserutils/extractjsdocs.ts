import doctrine from 'doctrine';
import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';

export function extractJsDoc(
  path: NodePath<t.Node>
): { description: string; tags: any[] } | null {
  const leadingComments = path.node.leadingComments;
  if (!leadingComments) return null;

  const comment = leadingComments.map((c) => c.value).join('\n');
  const parsed = doctrine.parse(comment, { unwrap: true });

  return {
    description: parsed.description || '',
    tags: parsed.tags.map((tag) => ({
      title: tag.title,
      name: tag.name || '',
      type: tag.type ? doctrine.type.stringify(tag.type) : '',
      description: tag.description || '',
    })),
  };
}
