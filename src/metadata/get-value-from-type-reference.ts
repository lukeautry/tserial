import ts from "typescript";
import { TypeScriptValue } from "../common/types";
import { getValueFromType } from "./get-value-from-type";
import { UnexpectedError } from "./common/unexpected-error";
import { getValueFromSymbol } from "./get-value-from-symbol";
import { UnsupportedError } from "./common/unsupported-error";
import { IGetValueParams } from "./get-value-params";

interface IGetTypeReferenceValueParams extends IGetValueParams {
  typeNode: ts.TypeReferenceNode;
}

export const getValueFromTypeReference = (
  params: IGetTypeReferenceValueParams
): TypeScriptValue => {
  const { typeChecker, typeNode, name, cache } = params;
  const { typeName } = typeNode;

  /**
   * There are assumptions here about how arrays will get parsed in the JS runtime.
   * At runtime, arrays are not simply data structures, but also have a variety of methods that are used. Whatever
   * is responsible for parsing the data will usually put collections into an array type, but it could also be some
   * specialized array type. For that reason, we need to use a text-based approach here.
   */
  const knownArrayNames = ["Array", "ReadonlyArray"];
  if (
    typeNode.typeArguments &&
    knownArrayNames.includes(typeNode.typeName.getText())
  ) {
    return cache.buildValue("array", {
      name,
      value: getValueFromType({
        ...params,
        typeNode: typeNode.typeArguments[0]
      })
    });
  }

  const checkedType = typeChecker.getTypeAtLocation(typeName);
  if (checkedType.aliasSymbol) {
    // TODO: There can be multiple declarations here; unclear what scenarios would allow for that
    const [declaration] = checkedType.aliasSymbol.declarations;
    if (ts.isTypeAliasDeclaration(declaration)) {
      // TODO: Implement support for mapped types, if possible
      if (ts.isMappedTypeNode(declaration.type)) {
        throw new UnsupportedError(
          "MAPPED_TYPES_NOT_ALLOWED",
          declaration.type
        );
      }

      return getValueFromType({
        ...params,
        typeNode: declaration.type
      });
    }
  }

  const symbol = checkedType.getSymbol();
  if (symbol) {
    return getValueFromSymbol({
      ...params,
      symbol,
      typeArguments: typeNode.typeArguments
    });
  }

  const resolvedTypeNode = typeChecker.typeToTypeNode(checkedType);
  if (resolvedTypeNode) {
    return getValueFromType({
      ...params,
      typeNode: resolvedTypeNode
    });
  }

  throw new UnexpectedError(
    `Couldn't determine referenced type for ${name}`,
    typeNode
  );
};
