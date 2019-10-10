import ts from "typescript";
import { UnexpectedError } from "./common/unexpected-error";
import { isSymbolWithId } from "./common/is-symbol-with-id";
import { UnsupportedError } from "./common/unsupported-error";
import { getValueFromInterface } from "./get-value-from-interface";
import { getValueFromEnumMember } from "./get-value-from-enum-member";
import { IGetValueParams } from "./get-value-params";

interface IGetValueFromSymbolParams extends IGetValueParams {
  symbol: ts.Symbol;
  typeArguments?: ts.NodeArray<ts.TypeNode>;
}

export const getValueFromSymbol = (params: IGetValueFromSymbolParams) => {
  const { symbol, typeChecker, cache, name } = params;

  const symbolRef = isSymbolWithId(symbol) && cache.getSymbolRef(symbol.id);
  if (symbolRef) {
    return cache.buildValue("reference", {
      name,
      refId: symbolRef
    });
  }

  if (symbol.declarations.some(d => ts.isClassDeclaration(d))) {
    throw new UnsupportedError("CLASS_NOT_ALLOWED");
  }

  // TODO: There could be non-interface declarations here
  const declarations = symbol.declarations.filter(d =>
    ts.isInterfaceDeclaration(d)
  ) as ts.InterfaceDeclaration[];

  if (declarations.length > 1) {
    const value = cache.buildValue("intersection", {
      name,
      values: []
    });

    if (isSymbolWithId(symbol)) {
      cache.setSymbolRef(symbol.id, value.id);
    }

    value.values.push(
      ...declarations.map(declaration => {
        return getValueFromInterface({
          ...params,
          node: declaration
        });
      })
    );

    return value;
  } else if (declarations.length === 1) {
    return getValueFromInterface({
      ...params,
      node: declarations[0]
    });
  }

  if (ts.isEnumDeclaration(symbol.valueDeclaration)) {
    const members = symbol.valueDeclaration.members;
    const values = new Array<string | number>();

    for (const member of members) {
      const value = getValueFromEnumMember({
        typeChecker,
        member
      });

      if (!values.includes(value)) {
        values.push(value);
      }
    }

    return cache.buildValue("enum", {
      name,
      values
    });
  }

  if (ts.isEnumMember(symbol.valueDeclaration)) {
    return cache.buildValue("enum-member", {
      name,
      value: getValueFromEnumMember({
        typeChecker,
        member: symbol.valueDeclaration
      })
    });
  }

  throw new UnexpectedError(`Couldn't determine value by symbol for ${name}`);
};
