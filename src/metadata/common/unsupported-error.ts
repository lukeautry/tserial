import ts from "typescript";
import { getLineAndCharacter } from "./get-line";

export const ErrorTypes = {
  FUNCTION_NOT_ALLOWED: "Functions cannot be serialized.",
  UNKNOWN_NOT_ALLOWED: "Symbols of type 'unknown' cannot be serialized.",
  NEVER_NOT_ALLOWED: "Symbols of type 'never' cannot be serialized.",
  VOID_NOT_ALLOWED: "Symbols of type 'void' cannot be serialized.",
  CLASS_NOT_ALLOWED: "Classes cannot be serialized.",
  OPERATOR_NOT_ALLOWED: "Type operator not supported.",
  MAPPED_TYPES_NOT_ALLOWED: "Mapped types are not supported at this time.",
  /**
   * Given `type MyGeneric<T> = T`, a valid serializable alias could be:
   *    `type TestAlias = MyGeneric<string>`
   */
  UNRESOLVED_GENERIC: "Generics must resolve to a fully qualified type."
};

type ErrorType = keyof typeof ErrorTypes;

export class UnsupportedError extends Error {
  public constructor(type: ErrorType, node?: ts.Node) {
    let processedMessage = ErrorTypes[type];
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
