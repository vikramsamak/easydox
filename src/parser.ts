import fs from 'fs';
import path from 'path';
import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import doctrine from 'doctrine';

type ComponentInfo = {
  componentName: string;
  props: string[];
  jsDoc: doctrine.Annotation | null;
};

export function parseFile(filePath: string): ComponentInfo[] {
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

function extractProps(
  params: (
    | t.Identifier
    | t.ObjectPattern
    | t.ArrayPattern
    | t.RestElement
    | t.AssignmentPattern
  )[]
): string[] {
  return params
    .map((param) => {
      if (t.isObjectPattern(param)) {
        return param.properties.map((prop) =>
          t.isObjectProperty(prop) && t.isIdentifier(prop.key)
            ? prop.key.name
            : null
        );
      } else if (t.isIdentifier(param)) {
        return param.name;
      }
      return null;
    })
    .flat()
    .filter(Boolean) as string[];
}

function extractJsDoc(
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

export function parseDirectory(sourceDir: string): ComponentInfo[] {
  if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
    console.error(
      `❌ Error: Source directory "${sourceDir}" does not exist or is not a directory.`
    );
    process.exit(1);
  }

  console.log(`🔍 Parsing components in directory: ${sourceDir}\n`);
  const files = fs.readdirSync(sourceDir);
  let allComponents: ComponentInfo[] = [];
  const validExtensions = ['.ts', '.js', '.jsx', '.tsx'];

  files.forEach((file) => {
    const fullPath = path.join(sourceDir, file);
    if (
      fs.statSync(fullPath).isFile() &&
      validExtensions.some((ext) => fullPath.endsWith(ext))
    ) {
      console.log(`📄 Processing file: ${file}`);
      allComponents = allComponents.concat(parseFile(fullPath));
    }
  });

  return allComponents;
}
