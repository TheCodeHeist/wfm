import fs from "fs";
import path from "path";
import { Token, Heading } from "./../interfaces/TokenInterfaces";

class Lexer {
  filePath: string;
  markdown: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.markdown = fs.readFileSync(path.join(process.cwd(), filePath), "utf8");

    console.log(this.returnTokens());
  }

  returnTokens() {
    let tokens = {
      fileData: this.markdown,
      lines: this.markdown.split("\n"),
      linesNumber: this.markdown.split("\n").length,
      tokens: [],
    } as Token;

    let lines = this.getEachLine();

    for (let i = 0; i < lines.length; i++) {
      if (this.getHeadingToken(lines[i]).isHeading) {
        tokens.tokens.push(this.getHeadingToken(lines[i]).token || {});
      } else {
        break;
      }
    }

    return tokens;
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

  getHeadingToken(lineParam: string): Heading {
    let callback = {} as Heading;

    let line = lineParam;

    if (line.startsWith("#")) {
      let level = 0;
      let tempLine = line;

      while (tempLine.startsWith("#")) {
        level++;
        tempLine = tempLine.substring(1);
      }

      callback.isHeading = true;
      callback.level = level;
      callback.token = {
        type: "h" + callback.level,
        rawData: line,
        data: line.substring(callback.level).trim(),
      };
    } else {
      callback.isHeading = false;
    }

    return callback;

    // let headingTokens: Array<HeadingToken> = [];
    // let lines = this.getEachLine();
    // for (let i = 0; i < lines.length; i++) {
    //   if (lines[i].startsWith("#")) {
    //     if (lines[i].startsWith("# ")) {
    //       headingTokens.push({
    //         type: "h1",
    //         rawData: lines[i],
    //         data: lines[i].substring(2),
    //       } as HeadingToken);
    //     } else if (lines[i].startsWith("## ")) {
    //       headingTokens.push({
    //         type: "h2",
    //         rawData: lines[i],
    //         data: lines[i].substring(3),
    //       } as HeadingToken);
    //     } else if (lines[i].startsWith("### ")) {
    //       headingTokens.push({
    //         type: "h3",
    //         rawData: lines[i],
    //         data: lines[i].substring(4),
    //       } as HeadingToken);
    //     } else if (lines[i].startsWith("#### ")) {
    //       headingTokens.push({
    //         type: "h4",
    //         rawData: lines[i],
    //         data: lines[i].substring(5),
    //       } as HeadingToken);
    //     } else if (lines[i].startsWith("##### ")) {
    //       headingTokens.push({
    //         type: "h5",
    //         rawData: lines[i],
    //         data: lines[i].substring(6),
    //       } as HeadingToken);
    //     } else if (lines[i].startsWith("###### ")) {
    //       headingTokens.push({
    //         type: "h6",
    //         rawData: lines[i],
    //         data: lines[i].substring(7),
    //       } as HeadingToken);
    //     } else {
    //       headingTokens.push({
    //         type: "error",
    //         rawData: lines[i],
    //         data: lines[i],
    //       } as HeadingToken);
    //     }
    //   } else {
    //     break;
    //   }
    // }
    // return headingTokens;
  }
}

export default Lexer;
