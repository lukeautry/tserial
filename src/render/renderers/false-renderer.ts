import { IRenderParams } from "./common/render-params";

export const falseRenderer: (params: IRenderParams<"false">) => string = ({
  cache,
  varName
}) => {
  cache.includeSnippet("false");
  return `assertFalse(${varName})`;
};
