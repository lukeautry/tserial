import { renderAssert } from "../render-assert";
import { IRenderParams } from "./common/render-params";

export const arrayRenderer: (params: IRenderParams<"array">) => string = ({
  cache,
  value,
  name
}) => {
  cache.includeSnippet("array-of-type");
  const elementVarName = `${cache.getPrefix()}e`;
  return `assertArrayOfType(value, ${elementVarName} => {
    return ${renderAssert({
      name,
      value: value.value,
      varName: elementVarName,
      cache
    })};
  })`;
};
