import { IRenderParams } from "./common/render-params";

export const numberRenderer: (params: IRenderParams<"number">) => string = ({
  cache,
  varName
}) => {
  cache.includeSnippet("number");
  return `assertNumber(${varName})`;
};
