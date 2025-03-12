import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { extractProps } from './parserutils';
import { extractJsDoc } from './parserutils';
import { generateCodeSnippet } from './parserutils';
import { ComponentInfo } from '../types';

export function fileParser(filePath: string): ComponentInfo[] {
  const code = fs.readFileSync(filePath, 'utf-8');
  const fileExtension = path.extname(filePath);
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
            const params = declaration.init.params.filter(
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
            const componentCode = generateCodeSnippet(path.node);

            components.push({
              componentName,
              props,
              jsDoc,
              code: componentCode,
              fileExtension,
            });
          }
        });
      }
    },
    FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
      if (path.node.id) {
        const componentName = path.node.id.name;
        const params = path.node.params.filter(
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
        const componentCode = generateCodeSnippet(path.node);

        components.push({
          componentName,
          props,
          jsDoc,
          code: componentCode,
          fileExtension,
        });
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
          const params = declaration.init.params.filter(
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
          const componentCode = generateCodeSnippet(path.node);

          components.push({
            componentName,
            props,
            jsDoc,
            code: componentCode,
            fileExtension,
          });
        }
      });
    },
  });

  return components;
}
