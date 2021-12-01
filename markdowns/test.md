---
title: Hello World!
# styles:
# - ./main.css
# - ./reset.css
# scripts:
# - ./app.js
# - ./menu.js
---


# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.

```ts
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
        tokens.tokens.push(this.getCodeBlockToken(lines[i]));
    } else {
        tokens.tokens.push(this.getParagraphToken(lines[i]));
    }
}

return tokens;
```

[index.ts](../index.ts)

<!-- This is a comment! -->

<!-- Multiple comments
Multiple comments
Multiple comments
Multiple comments
Multiple comments
Multiple comments -->
