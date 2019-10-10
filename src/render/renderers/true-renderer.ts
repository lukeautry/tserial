import { IRenderParams } from "./common/render-params";

export const trueRenderer: (params: IRenderParams<"true">) => string = ({
  cache,
  varName
}) => {
  cache.includeSnippet("true");
  return `assertTrue(${varName})`;
};
