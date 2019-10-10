import ts from "typescript";
import { UnsupportedError } from "../common/unsupported-error";

export const checkUnsupportedTypes = (node: ts.Node) => {
  if (ts.isFunctionLike(node)) {
    throw new UnsupportedError("FUNCTION_NOT_ALLOWED");
  }

  if (node.kind === ts.SyntaxKind.UnknownKeyword) {
    throw new UnsupportedError("UNKNOWN_NOT_ALLOWED");
  }

  if (node.kind === ts.SyntaxKind.NeverKeyword) {
    throw new UnsupportedError("NEVER_NOT_ALLOWED");
  }

  if (node.kind === ts.SyntaxKind.VoidKeyword) {
    throw new UnsupportedError("VOID_NOT_ALLOWED");
  }
};
