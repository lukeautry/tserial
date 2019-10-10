import ts from "typescript";
import { getValueFromType } from "./get-value-from-type";
import { getValueFromIndexSignature } from "./get-value-from-index-signature";
import { UnexpectedError } from "./common/unexpected-error";
import { IGetValueParams } from "./get-value-params";

interface IGetValueFromTypeLiteralParams extends IGetValueParams {
  typeNode: ts.TypeLiteralNode;
}

export const getValueFromTypeLiteral = (
  params: IGetValueFromTypeLiteralParams
) => {
  const { cache, typeNode, typeChecker, name } = params;

  return cache.buildValue("object", {
    name,
    properties: typeNode.members.map(member => {
      if (ts.isPropertySignature(member) && member.type) {
        return getValueFromType({
          typeNode: member.type,
          name: ts.isIdentifier(member.name)
            ? member.name.text
            : member.name.getText(),
          typeChecker,
          cache
        });
      } else if (ts.isIndexSignatureDeclaration(member)) {
        return getValueFromIndexSignature({
          node: member,
          typeChecker,
          cache,
          name
        });
      } else {
        throw new UnexpectedError(
          "Expected object literal property to be a PropertySignature and to have a type",
          member
        );
      }
    })
  });
};
