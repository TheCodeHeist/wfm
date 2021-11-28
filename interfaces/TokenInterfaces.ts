// Token
export interface Token {
  fileData: string;
  lines: string[];
  linesNumber: number;
  tokens: Object[];
}

// Heading
export interface Heading {
  isHeading: boolean;
  level?: number;
  token?: HeadingToken;
}

export interface HeadingToken {
  type: string;
  rawData: string;
  data: string;
}
