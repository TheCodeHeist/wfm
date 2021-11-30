// Token
export interface Tokens {
  fileData: string;
  frontMatter: any;
  lines: string[];
  linesNumber: number;
  tokens: Object[];
}

export interface Token {
  type: string;
  rawData: string;
  data: string | object;
}
