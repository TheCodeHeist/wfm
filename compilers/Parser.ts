import { Tokens } from "./../interfaces/TokenInterfaces";
import fs from "fs";
import path from "path";

let template: string;

class Parser {
  lexerResults: Tokens;
  outputPath: string;

  constructor(lexerResults: Tokens, outputPath: string) {
    this.lexerResults = lexerResults;
    this.outputPath = outputPath;

    this.createFile();
  }

  parse() {
    const { frontMatter } = this.lexerResults;
    // console.log(frontMatter.data);
    let title =
      frontMatter.data.title === undefined ? "" : frontMatter.data.title;
    let styles =
      frontMatter.data.styles === undefined ? "" : frontMatter.data.styles;
    let scripts =
      frontMatter.data.scripts === undefined ? "" : frontMatter.data.scripts;
    let body = this.bodyParser();

    let allStyles = "";
    let allScripts = "";

    if (styles !== "") {
      styles.forEach((style: string) => {
        allStyles += `<link rel="stylesheet" href="${style}">\n`;
      });
    } else {
      allStyles = "";
    }

    if (scripts !== "") {
      scripts.forEach((script: string) => {
        allScripts += `<script src="${script}"></script>\n`;
      });
    } else {
      allScripts = "";
    }

    template = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
${allStyles}
</head>
<body>
${body}

${allScripts}
</body>
</html>
`;

    return template;
  }

  bodyParser() {
    const { tokens } = this.lexerResults;
    let body = "";

    tokens.forEach((token: any) => {
      if (token.type === "p") {
        body += `<p>${token.data}</p>\n`;
      } else if (token.type.startsWith("h")) {
        body += `<h${token.type.slice(1)}>${token.data}</h${token.type.slice(
          1
        )}>\n`;
      } else if (token.type === "a") {
        body += `<a href="${token.data.url}">${token.data.name}</a>\n`;
      }
    });

    return body;
  }

  createFile() {
    let outputDir = this.outputPath.split("/").slice(0, -1).join("/");
    let outputFileName = this.outputPath.split("/").slice(-1).join("/");

    // console.log(outputDir);
    // console.log(outputFileName);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(outputDir, outputFileName),
      this.parse(),
      "utf8"
    );

    console.log(
      `${outputFileName} created at ${path.join(process.cwd(), outputDir)} !`
    );
  }
}

export default Parser;
