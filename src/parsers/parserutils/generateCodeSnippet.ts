import generate from '@babel/generator';
import * as t from '@babel/types';

function removeComments(node: t.Node) {
  if ('leadingComments' in node) {
    node.leadingComments = null;
  }
  if ('trailingComments' in node) {
    node.trailingComments = null;
  }
  if ('innerComments' in node) {
    node.innerComments = null;
  }
}

export function generateCodeSnippet(node: t.Node): string {
  removeComments(node);
  const { code } = generate(node, { retainLines: true });
  return code.trim();
}
