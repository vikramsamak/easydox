import * as t from '@babel/types';

export function extractProps(
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
        // { a, b }
        return param.properties.map((prop) => {
          if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
            return prop.key.name;
          } else if (t.isRestElement(prop) && t.isIdentifier(prop.argument)) {
            return `...${prop.argument.name}`;
          }
          return null;
        });
      } else if (t.isArrayPattern(param)) {
        // [a, b]
        return param.elements.map((el) => {
          if (t.isIdentifier(el)) {
            return el.name;
          } else if (t.isRestElement(el) && t.isIdentifier(el.argument)) {
            return `...${el.argument.name}`;
          } else if (t.isAssignmentPattern(el) && t.isIdentifier(el.left)) {
            return el.left.name;
          }
          return null;
        });
      } else if (t.isAssignmentPattern(param) && t.isIdentifier(param.left)) {
        // param = defaultValue
        return param.left.name;
      } else if (t.isRestElement(param) && t.isIdentifier(param.argument)) {
        // ...args
        return `...${param.argument.name}`;
      } else if (t.isIdentifier(param)) {
        // normal param
        return param.name;
      }
      return null;
    })
    .flat()
    .filter(Boolean) as string[];
}
