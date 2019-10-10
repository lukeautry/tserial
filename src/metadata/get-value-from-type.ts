import ts from "typescript";
import { TypeScriptValue } from "../common/types";
import { getValueFromTypeReference } from "./get-value-from-type-reference";
import { UnexpectedError } from "./common/unexpected-error";
import { checkUnsupportedTypes } from "./common/check-unsupported-types";
import { getValueFromPrimitiveLike } from "./get-value-from-primitive-like";
import { getValueFromTypeQuery } from "./get-value-from-type-query";
import { getValueFromTypeLiteral } from "./get-value-from-type-literal";
import { IGetValueParams } from "./get-value-params";
import { getValueFromTypeOperator } from "./get-value-from-type-operator";
import { getValueFromLiteral } from "./get-value-from-literal";

interface IGetValueFromTypeParams extends IGetValueParams {
  typeNode: ts.TypeNode;
}

export const getValueFromType = (
  params: IGetValueFromTypeParams
): TypeScriptValue => {
  const { typeNode, name, typeChecker, cache } = params;

  const cachedRef = cache.getNodeRef(typeNode);
  if (cachedRef) {
    return cache.buildValue("reference", {
      name,
      refId: cachedRef
    });
  }

  checkUnsupportedTypes(typeNode);

  const primitiveValue = getValueFromPrimitiveLike(params);
  if (primitiveValue) {
    return primitiveValue;
  }

  const { buildValue } = cache;

  if (ts.isTypeQueryNode(typeNode)) {
    return getValueFromTypeQuery({ ...params, typeNode });
  }

  if (ts.isTypeOperatorNode(typeNode)) {
    return getValueFromTypeOperator({ ...params, typeNode });
  }

  if (ts.isUnionTypeNode(typeNode)) {
    return buildValue("union", {
      name,
      values: typeNode.types.map(t =>
        getValueFromType({ ...params, typeNode: t })
      )
    });
  }

  if (ts.isIntersectionTypeNode(typeNode)) {
    return buildValue("intersection", {
      name,
      values: typeNode.types.map(t =>
        getValueFromType({ typeNode: t, name, typeChecker, cache })
      )
    });
  }

  if (ts.isArrayTypeNode(typeNode)) {
    return buildValue("array", {
      name,
      value: getValueFromType({
        ...params,
        typeNode: typeNode.elementType
      })
    });
  }

  if (ts.isTupleTypeNode(typeNode)) {
    return buildValue("tuple", {
      name,
      values: typeNode.elementTypes.map(t =>
        getValueFromType({
          ...params,
          typeNode: t
        })
      )
    });
  }

  if (ts.isLiteralTypeNode(typeNode)) {
    return getValueFromLiteral({
      ...params,
      typeNode
    });
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    return getValueFromTypeReference({
      ...params,
      typeNode
    });
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    return getValueFromTypeLiteral({
      ...params,
      typeNode
    });
  }

  throw new UnexpectedError(`Unknown type for type ${name}`, typeNode);
};
