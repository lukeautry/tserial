import { IRenderParams } from "./common/render-params";

export const stringLiteralRenderer: (
  params: IRenderParams<"string-literal">
) => string = ({ cache, varName, value }) => {
  cache.includeSnippet("string-literal");
  return `assertStringLiteral(${varName}, '${value.value}')`;
};
