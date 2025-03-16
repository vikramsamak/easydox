import fs from 'fs';
import path from 'path';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { parse } from '@babel/parser';
import { extractProps, extractJsDoc, generateCodeSnippet } from './parserutils';
import { ComponentInfo } from '../types';

export function fileParser(filePath: string): ComponentInfo[] {
  const code = fs.readFileSync(filePath, 'utf-8');
  const fileExtension = path.extname(filePath);
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  const components: ComponentInfo[] = [];

  const extractComponentInfo = (
    node:
      | t.FunctionDeclaration
      | t.ArrowFunctionExpression
      | t.FunctionExpression,
    componentName: string,
    path: NodePath<t.Node>
  ) => {
    const params = node.params.filter(
      (
        param
      ): param is
        | t.Identifier
        | t.ObjectPattern
        | t.ArrayPattern
        | t.AssignmentPattern
        | t.RestElement =>
        t.isIdentifier(param) ||
        t.isObjectPattern(param) ||
        t.isArrayPattern(param) ||
        t.isAssignmentPattern(param) ||
        t.isRestElement(param)
    );

    const props = extractProps(params);
    const jsDoc = extractJsDoc(path);
    const componentCode = generateCodeSnippet(node);

    components.push({
      componentName,
      props,
      jsDoc,
      code: componentCode,
      fileExtension,
    });
  };

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
            extractComponentInfo(declaration.init, declaration.id.name, path);
          }
        });
      }
    },
    FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
      if (path.node.id) {
        extractComponentInfo(path.node, path.node.id.name, path);
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
          extractComponentInfo(declaration.init, declaration.id.name, path);
        }
      });
    },
  });

  return components;
}
