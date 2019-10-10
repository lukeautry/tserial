import ts from "typescript";
import { getValueFromType } from "./get-value-from-type";
import { UnexpectedError } from "./common/unexpected-error";
import { IGetValueParams } from "./get-value-params";

interface IGetValueFromIndexSignatureParams extends IGetValueParams {
  node: ts.IndexSignatureDeclaration;
}

export const getValueFromIndexSignature = ({
  node,
  cache,
  typeChecker,
  name
}: IGetValueFromIndexSignatureParams) => {
  const parameter = node.parameters[0];
  if (!node.type || !parameter || !parameter.type) {
    throw new UnexpectedError(
      "Expected index signature declaration to have a parameter, parameter type, and type.",
      node
    );
  }

  return cache.buildValue("index", {
    name,
    key: getValueFromType({
      typeChecker,
      cache,
      name,
      typeNode: parameter.type
    }),
    value: getValueFromType({
      typeChecker,
      cache,
      name,
      typeNode: node.type
    })
  });
};
