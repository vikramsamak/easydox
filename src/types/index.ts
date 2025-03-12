import { Annotation } from 'doctrine';

export type ComponentInfo = {
  componentName: string;
  props: string[];
  jsDoc: Annotation | null;
  code: string;
  fileExtension: string;
};

export interface CLIOptions {
  format: string;
  output: string;
  enableAI: boolean;
}

export type ChalkColors =
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'gray';
