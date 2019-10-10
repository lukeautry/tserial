import ts from "typescript";
import { getLineAndCharacter } from "./get-line";

export class UnexpectedError extends Error {
  public constructor(message: string, node?: ts.Node) {
    let processedMessage = message;
    if (node) {
      const info = getLineAndCharacter(node);
      if (info) {
        const { file, line, character } = info;
        processedMessage = `${file}:${line}:${character} - ${processedMessage}`;
      }
    }

    super(processedMessage);
  }
}
