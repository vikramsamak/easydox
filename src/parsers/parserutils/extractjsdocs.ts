import * as t from '@babel/types';
import doctrine, { Tag } from 'doctrine';
import { NodePath } from '@babel/traverse';
import { JsDocInfo } from '../../types';

export function extractJsDoc(path: NodePath<t.Node>): JsDocInfo | null {
  const leadingComments = path.node.leadingComments;
  if (!leadingComments || leadingComments.length === 0) return null;

  const docComment = leadingComments
    .filter((c) => c.type === 'CommentBlock' && c.value.startsWith('*'))
    .map((c) => c.value)
    .join('\n');

  if (!docComment) return null;

  try {
    const parsed = doctrine.parse(`/*${docComment}*/`, {
      unwrap: true,
      sloppy: true,
    });

    return {
      description: parsed.description || '',
      tags: (parsed.tags as Tag[]).map((tag) => ({
        title: tag.title,
        name: tag.name || '',
        type: tag.type ? doctrine.type.stringify(tag.type) : '',
        description: tag.description || '',
      })),
    };
  } catch (err) {
    console.warn('⚠️ Failed to parse JSDoc:', err);
    return null;
  }
}
