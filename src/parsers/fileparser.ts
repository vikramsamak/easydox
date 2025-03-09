import fs from 'fs';
import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { ComponentInfo } from '../types';
import { extractProps } from './parserutils/extractprops';
import { extractJsDoc } from './parserutils/extractjsdocs';

export function fileParser(filePath: string): ComponentInfo[] {
  const code = fs.readFileSync(filePath, 'utf-8');
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  const components: ComponentInfo[] = [];

  traverse(ast, {
    ExportNamedDeclaration(path: NodePath<t.ExportNamedDeclaration>) {
      if (t.isVariableDeclaration(path.node.declaration)) {
        path.node.declaration.declarations.forEach((declaration) => {
          if (
            t.isVariableDeclarator(declaration) &&
            t.isIdentifier(declaration.id) &&
            (t.isArrowFunctionExpression(declaration.init) ||
              t.isFunctionExpression(declaration.init))
          ) {
            const componentName = declaration.id.name;
            const props = extractProps(declaration.init.params);
            const jsDoc = extractJsDoc(path);
            components.push({ componentName, props, jsDoc });
          }
        });
      }
    },
    FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
      if (path.node.id) {
        const componentName = path.node.id.name;
        const props = extractProps(path.node.params);
        const jsDoc = extractJsDoc(path);
        components.push({ componentName, props, jsDoc });
      }
    },
    VariableDeclaration(path: NodePath<t.VariableDeclaration>) {
      path.node.declarations.forEach((declaration) => {
        if (
          t.isVariableDeclarator(declaration) &&
          t.isIdentifier(declaration.id) &&
          (t.isArrowFunctionExpression(declaration.init) ||
            t.isFunctionExpression(declaration.init))
        ) {
          const componentName = declaration.id.name;
          const props = extractProps(declaration.init.params);
          const jsDoc = extractJsDoc(path);
          components.push({ componentName, props, jsDoc });
        }
      });
    },
  });

  return components;
}
