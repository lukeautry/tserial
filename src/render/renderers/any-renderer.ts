import { IRenderParams } from "./common/render-params";

export const anyRenderer: (params: IRenderParams<"any">) => string = ({
  cache,
  varName
}) => {
  cache.includeSnippet("success");
  return `(() => success(${varName} as any))()`;
};
