export type ComponentInfo = {
  componentName: string;
  props: string[];
  jsDoc: JsDocInfo | null;
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

export interface JsDocTag {
  title: string;
  name: string;
  type: string;
  description: string;
  optional?: boolean;
  defaultValue?: string;
}

export interface JsDocInfo {
  description: string;
  tags: JsDocTag[];
}

export interface JsDocTag {
  title: string;
  name: string;
  type: string;
  description: string;
}
