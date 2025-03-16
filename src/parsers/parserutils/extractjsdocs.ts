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
      recoverable: true,
    });

    const tags = (parsed.tags as Tag[]).map((tag) => {
      let typeString = tag.type ? doctrine.type.stringify(tag.type) : '';
      typeString = typeString.replace(/\=$/, ''); // remove trailing '='

      // Optional & Default Handling
      let optional = false;
      let defaultValue: string | undefined;

      if (tag.name && tag.name.startsWith('[') && tag.name.endsWith(']')) {
        optional = true;
        const inner = tag.name.slice(1, -1); // remove brackets []

        if (inner.includes('=')) {
          const [paramName, defVal] = inner.split('=');
          tag.name = paramName;
          defaultValue = defVal;
        } else {
          tag.name = inner;
        }
      }

      return {
        title: tag.title,
        name: tag.name || '',
        type: typeString,
        description: tag.description || '',
        optional,
        defaultValue,
      };
    });

    return {
      description: parsed.description || '',
      tags,
    };
  } catch (err) {
    console.warn('⚠️ Failed to parse JSDoc:', err);
    return null;
  }
}
