import { Annotation } from 'doctrine';

export type ComponentInfo = {
  componentName: string;
  props: string[];
  jsDoc: Annotation | null;
  code: string;
};
