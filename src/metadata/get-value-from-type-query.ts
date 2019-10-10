import ts from "typescript";
import { getValueFromSymbol } from "./get-value-from-symbol";
import { getValueFromType } from "./get-value-from-type";
import { IGetValueParams } from "./get-value-params";

interface IGetValueFromTypeQueryParams extends IGetValueParams {
  typeNode: ts.TypeQueryNode;
}

export const getValueFromTypeQuery = (params: IGetValueFromTypeQueryParams) => {
  const { typeChecker, typeNode } = params;
  const checkedType = typeChecker.getTypeAtLocation(typeNode);
  const checkedTypeNode = typeChecker.typeToTypeNode(checkedType);
  if (checkedTypeNode) {
    if (ts.isTypeReferenceNode(checkedTypeNode)) {
      return getValueFromSymbol({
        ...params,
        typeArguments: checkedTypeNode.typeArguments,
        symbol: checkedType.symbol
      });
    } else {
      return getValueFromType({
        ...params,
        typeNode: checkedTypeNode
      });
    }
  }

  throw new Error(`Couldn't determine type node of typeof expression.`);
};
