import ts from "typescript";

interface ISymbolWithId extends ts.Symbol {
  id: number;
}

/**
 * TypeScript typings don't seem to expose the id property on `Symbol`, although it seems to exist at runtime.
 * If this is meant to be a private property of sorts, we may want to deprecate this as it could represent a future breaking change.
 */
export const isSymbolWithId = (
  symbol: ts.Symbol | undefined
): symbol is ISymbolWithId => {
  if (!symbol) {
    return false;
  }

  return typeof symbol["id" as keyof ts.Symbol] === "number";
};
