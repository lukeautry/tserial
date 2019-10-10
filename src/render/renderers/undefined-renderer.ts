import { IRenderParams } from "./common/render-params";

export const undefinedRenderer: (
  params: IRenderParams<"undefined">
) => string = ({ cache, varName }) => {
  cache.includeSnippet("undefined");
  return `assertUndefined(${varName})`;
};
