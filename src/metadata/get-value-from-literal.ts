import ts from "typescript";
import { IGetValueParams } from "./get-value-params";
import { UnexpectedError } from "./common/unexpected-error";

interface IGetValueFromLiteral extends IGetValueParams {
  typeNode: ts.LiteralTypeNode;
}

export const getValueFromLiteral = ({
  cache,
  typeNode,
  name
}: IGetValueFromLiteral) => {
  const { buildValue } = cache;

  if (ts.isStringLiteral(typeNode.literal)) {
    return buildValue("string-literal", {
      value: typeNode.literal.text,
      name
    });
  }

  if (ts.isNumericLiteral(typeNode.literal)) {
    return buildValue("numeric-literal", {
      value: parseFloat(typeNode.literal.text),
      name
    });
  }

  if (typeNode.literal.kind === ts.SyntaxKind.TrueKeyword) {
    return buildValue("true", {
      name
    });
  }

  if (typeNode.literal.kind === ts.SyntaxKind.FalseKeyword) {
    return buildValue("false", {
      name
    });
  }

  throw new UnexpectedError(`Unknown type of literal '${name}'`);
};
