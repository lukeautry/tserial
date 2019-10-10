import { IRenderParams } from "./common/render-params";

export const booleanRenderer: (params: IRenderParams<"boolean">) => string = ({
  cache,
  varName
}) => {
  cache.includeSnippet("boolean");
  return `assertBoolean(${varName})`;
};
