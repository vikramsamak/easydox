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
