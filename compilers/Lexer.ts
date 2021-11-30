import fs from "fs";
import path from "path";
import { Tokens, Token } from "./../interfaces/TokenInterfaces";
import matter from "gray-matter";

class Lexer {
  filePath: string;
  markdown: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.markdown = fs.readFileSync(path.join(process.cwd(), filePath), "utf8");

    if (this.markdown === "") {
      console.log("File is empty!");

      process.exit(1);
    }
  }

  returnTokens() {
    let tokens = {
      fileData: this.markdown,
      frontMatter: this.getFrontMatter(),
      lines: this.markdown.split("\n"),
      linesNumber: this.markdown.split("\n").length,
      tokens: [],
    } as Tokens;

    let lines = this.getEachLine();

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("#")) {
        tokens.tokens.push(this.getHeadingToken(lines[i]));
      } else if (lines[i].startsWith("[")) {
        tokens.tokens.push(this.getLinkToken(lines[i]));
      } else {
        tokens.tokens.push(this.getParagraphToken(lines[i]));
      }
    }

    return tokens;
  }

  getFrontMatter() {
    let frontMatter = matter(this.markdown);
    return frontMatter;
  }

  getEachLine(): string[] {
    let lines: string[] = this.getFrontMatter().content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      lines[i] = lines[i].trim();
    }

    for (let i = 0; i < lines.length; i++) {
      // remove empty lines
      if (lines[i] === "") {
        lines.splice(i, 1);
      }
    }

    for (let i = 0; i < lines.length; i++) {
      // remove comments
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

    for (let i = 0; i < lines.length; i++) {
      // remove empty lines
      if (lines[i] === "") {
        lines.splice(i, 1);
      }
    }

    return lines;
  }

  getHeadingToken(lineParam: string): Token {
    let callback = {} as Token;

    let line = lineParam;

    if (line.startsWith("#")) {
      let level = 0;
      let tempLine = line;

      while (tempLine.startsWith("#")) {
        level++;
        tempLine = tempLine.substring(1);
      }

      callback.type = "h" + level;
      callback.rawData = line;
      callback.data = line.substring(level).trim();
    } else {
      callback.type = "null";
    }

    return callback;
  }

  getParagraphToken(lineParam: string): Token {
    let callback = {} as Token;

    let line = lineParam;

    if (!line.startsWith("#")) {
      callback.type = "p";
      callback.rawData = line;
      callback.data = line.trim();
    } else {
      callback.type = "null";
    }

    return callback;
  }

  getLinkToken(lineParam: string): Token {
    let callback = {} as Token;

    let line = lineParam;

    if (line.startsWith("[")) {
      let tempLine = line;

      tempLine = tempLine.substring(1);

      let linkName = "";
      let linkUrl = "";

      let i = 0;

      while (tempLine[i] !== "]") {
        linkName += tempLine[i];
        i++;
      }

      i++;

      if (tempLine[i] === "(") {
        i++;
        while (tempLine[i] !== ")") {
          linkUrl += tempLine[i];
          i++;
        }
      } else {
        while (tempLine[i] !== " ") {
          linkUrl += tempLine[i];
          i++;
        }
      }

      callback.type = "a";
      callback.rawData = line;
      callback.data = {
        name: linkName,
        url: linkUrl,
      };
    } else {
      callback.type = "null";
    }

    return callback;
  }
}

export default Lexer;
