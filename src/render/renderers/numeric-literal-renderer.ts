import { IRenderParams } from "./common/render-params";

export const numericLiteralRenderer: (
  params: IRenderParams<"numeric-literal">
) => string = ({ cache, varName, value }) => {
  cache.includeSnippet("numeric-literal");
  return `assertNumericLiteral(${varName}, ${value.value})`;
};
