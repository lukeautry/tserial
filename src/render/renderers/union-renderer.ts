import { LINE_BREAK } from "../../common/constants";
import { renderAssert } from "../render-assert";
import { IRenderParams } from "./common/render-params";

export const unionRenderer: (params: IRenderParams<"union">) => string = ({
  cache,
  value,
  varName,
  name
}) => {
  const prefix = cache.getPrefix();
  const prefixedVarName = (index: number) => `${prefix}${index}`;
  return `(() => {
    ${value.values
      .map((v, i) => {
        const resultVarName = prefixedVarName(i);
        return `const ${resultVarName} = ${renderAssert({
          name,
          value: v,
          varName,
          cache
        })};
      if (${resultVarName}.kind === 'success') { return ${resultVarName}; }`;
      })
      .join(LINE_BREAK)}

    return {
      kind: 'one-of',
      values: [${value.values.map((_v, i) => `${prefixedVarName(i)}`)}]
    } as const;
  })()`;
};
