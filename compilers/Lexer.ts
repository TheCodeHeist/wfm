import fs from "fs";
import path from "path";
import { Tokens, Token } from "./../interfaces/TokenInterfaces";
import matter from "gray-matter";

class Lexer {
  filePath: string;
  markdown: string;
  codeblock_state: boolean = false;
  codeblock_state_lang: string | null = "";
  codeblock_state_code: string = "";

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
      } else if (lines[i].startsWith("```")) {
        this.getCodeBlockToken(lines[i]);

        while (this.codeblock_state) {
          i++;
          this.getCodeBlockToken(lines[i]);
        }

        this.codeblock_state_code = this.codeblock_state_code.substring(1);
        this.codeblock_state_code = this.codeblock_state_code.substring(
          0,
          this.codeblock_state_code.length - 1
        );

        tokens.tokens.push({
          type: "code_block",
          rawData: lines[i],
          data: {
            lang: this.codeblock_state_lang,
            code: this.codeblock_state_code,
          },
        });
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

  getCodeBlockToken(lineParam: string): void {
    let line = lineParam;
    let tempLine = line;

    if (line.startsWith("```")) {
      if (tempLine === "```") {
        tempLine = tempLine.substring(3);

        this.codeblock_state = true;
      } else {
        tempLine = tempLine.substring(3);

        this.codeblock_state_lang = tempLine;

        this.codeblock_state = true;

        tempLine = "";
      }
    }

    this.codeblock_state_code += tempLine + "\n";

    if (line.endsWith("```")) {
      this.codeblock_state = false;
    }

    return;
  }
}

// let result = new Lexer("./markdowns/test.md").returnTokens();

// console.log(result.tokens[result.tokens.length - 2]);

export default Lexer;
