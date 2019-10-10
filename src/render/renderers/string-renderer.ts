import { IRenderParams } from "./common/render-params";

export const stringRenderer: (params: IRenderParams<"string">) => string = ({
  cache,
  varName
}) => {
  cache.includeSnippet("string");
  return `assertString(${varName})`;
};
