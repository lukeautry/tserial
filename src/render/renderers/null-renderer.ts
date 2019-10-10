import { IRenderParams } from "./common/render-params";

export const nullRenderer: (params: IRenderParams<"null">) => string = ({
  cache,
  varName
}) => {
  cache.includeSnippet("null");
  return `assertNull(${varName})`;
};
