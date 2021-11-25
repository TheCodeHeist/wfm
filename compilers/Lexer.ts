import fs from "fs";
import path from "path";

interface HeadingToken {
  type: string;
  rawData: string;
  data: string;
}

class Lexer {
  filePath: string;
  markdown: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.markdown = fs.readFileSync(path.join(process.cwd(), filePath), "utf8");

    console.log(this.getHeadingTokens());
  }

  getEachLine(): string[] {
    let lines: string[] = this.markdown.split("\n");

    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].trim();
    }

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === "") {
        lines.splice(i, 1);
      }
    }

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("<!--") && lines[i].endsWith("-->")) {
        lines.splice(i, 1);
      }

      if (lines[i].startsWith("<!--") && !lines[i].endsWith("-->")) {
        let j = i;

        while (!lines[j].endsWith("-->")) {
          j++;
        }

        lines.splice(i, j - i + 1);
      }
    }

    return lines;
  }

  getHeadingTokens(): Array<HeadingToken> {
    let headingTokens: Array<HeadingToken> = [];

    let lines = this.getEachLine();

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#")) {
        if (lines[i].startsWith("# ")) {
          headingTokens.push({
            type: "h1",
            rawData: lines[i],
            data: lines[i].substring(2),
          } as HeadingToken);
        } else if (lines[i].startsWith("## ")) {
          headingTokens.push({
            type: "h2",
            rawData: lines[i],
            data: lines[i].substring(3),
          } as HeadingToken);
        } else if (lines[i].startsWith("### ")) {
          headingTokens.push({
            type: "h3",
            rawData: lines[i],
            data: lines[i].substring(4),
          } as HeadingToken);
        } else if (lines[i].startsWith("#### ")) {
          headingTokens.push({
            type: "h4",
            rawData: lines[i],
            data: lines[i].substring(5),
          } as HeadingToken);
        } else if (lines[i].startsWith("##### ")) {
          headingTokens.push({
            type: "h5",
            rawData: lines[i],
            data: lines[i].substring(6),
          } as HeadingToken);
        } else if (lines[i].startsWith("###### ")) {
          headingTokens.push({
            type: "h6",
            rawData: lines[i],
            data: lines[i].substring(7),
          } as HeadingToken);
        } else {
          headingTokens.push({
            type: "error",
            rawData: lines[i],
            data: lines[i],
          } as HeadingToken);
        }
      } else {
        break;
      }
    }

    return headingTokens;
  }
}

export default Lexer;
