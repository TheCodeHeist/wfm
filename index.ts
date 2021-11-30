import Lexer from "./compilers/Lexer";
import Parser from "./compilers/Parser";

let result = new Lexer("./markdowns/test.md").returnTokens();

new Parser(result, "./out/test.html");
// console.log(result);
