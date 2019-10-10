import ts from "typescript";
import { IGetValueParams } from "./get-value-params";

interface IGetValueFromPrimitiveLikeParams extends IGetValueParams {
  typeNode: ts.Node;
}

export const getValueFromPrimitiveLike = ({
  typeNode,
  cache,
  name
}: IGetValueFromPrimitiveLikeParams) => {
  const { buildValue } = cache;

  if (typeNode.kind === ts.SyntaxKind.StringKeyword) {
    return buildValue("string", {
      name
    });
  }

  if (typeNode.kind === ts.SyntaxKind.AnyKeyword) {
    return buildValue("any", {
      name
    });
  }

  if (typeNode.kind === ts.SyntaxKind.NumberKeyword) {
    return buildValue("number", {
      name
    });
  }

  if (typeNode.kind === ts.SyntaxKind.NullKeyword) {
    return buildValue("null", {
      name
    });
  }

  if (typeNode.kind === ts.SyntaxKind.UndefinedKeyword) {
    return buildValue("undefined", {
      name
    });
  }

  if (typeNode.kind === ts.SyntaxKind.BooleanKeyword) {
    return buildValue("boolean", {
      name
    });
  }

  return;
};
