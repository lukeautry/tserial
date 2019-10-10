import ts from "typescript";
import { IGetValueParams } from "./get-value-params";
import { UnexpectedError } from "./common/unexpected-error";
import { UnsupportedError } from "./common/unsupported-error";

interface IGetValueFromTypeOperatorParams extends IGetValueParams {
  typeNode: ts.TypeOperatorNode;
}

export const getValueFromTypeOperator = ({
  typeNode,
  typeChecker,
  cache,
  name
}: IGetValueFromTypeOperatorParams) => {
  if (typeNode.operator === ts.SyntaxKind.KeyOfKeyword) {
    const checkedType = typeChecker.getTypeAtLocation(typeNode);
    if (checkedType.isUnion()) {
      return cache.buildValue("union", {
        name,
        values: checkedType.types.map(t => {
          if (!t.isStringLiteral()) {
            throw new UnexpectedError(
              `Expected keyof type to be a string literal.`
            );
          }

          return cache.buildValue("string-literal", {
            name,
            value: t.value
          });
        })
      });
    }
  }

  throw new UnsupportedError("OPERATOR_NOT_ALLOWED");
};
