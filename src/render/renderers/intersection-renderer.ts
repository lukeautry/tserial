import { LINE_BREAK } from "../../common/constants";
import { renderAssert } from "../render-assert";
import { IRenderParams } from "./common/render-params";

export const intersectionRenderer: (
  params: IRenderParams<"intersection">
) => string = ({ cache, value, varName, name }) => {
  const prefix = cache.getPrefix();
  const prefixedVarName = (index: number) => `${prefix}${index}`;
  return `(() => {
      ${value.values
        .map((v, i) => {
          const lastPropVarName = () =>
            i === 0 ? varName : `${prefixedVarName(i - 1)}.value`;
          const propVarName = prefixedVarName(i);
          return `const ${propVarName} = ${renderAssert({
            name,
            value: v,
            varName: lastPropVarName(),
            cache
          })};
        if (!${propVarName}.success) { return ${propVarName}; }`;
        })
        .join(LINE_BREAK)}

        return ${
          value.values.length > 0
            ? prefixedVarName(value.values.length - 1)
            : `success(${varName})`
        }
      })()`;
};
