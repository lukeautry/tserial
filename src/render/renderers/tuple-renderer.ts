import { LINE_BREAK } from "../../common/constants";
import { renderAssert } from "../render-assert";
import { IRenderParams } from "./common/render-params";

export const tupleRenderer: (params: IRenderParams<"tuple">) => string = ({
  cache,
  value,
  varName,
  name
}) => {
  cache.includeSnippet("array", "success", "error");
  const prefix = cache.getPrefix();
  const prefixedVarName = (index: number) => `${prefix}${index}`;

  return `(() => {
    if (isArray(${varName})) {
      ${value.values
        .map((tupleVal, i) => {
          const elementVarName = prefixedVarName(i);
          return `
            const ${elementVarName} = ${renderAssert({
            name: `${name}`,
            value: tupleVal,
            varName: `${varName}[${i}]`,
            cache
          })};
          if (!${elementVarName}.success) {
            return error('keyed', {
              key: '[${i}]',
              value: ${elementVarName}
            });
          }
      `;
        })
        .join(LINE_BREAK)}

      return success([${value.values.map(
        (_v, i) => `${prefixedVarName(i)}.value`
      )}] as [
        ${value.values
          .map((_v, i) => `typeof ${prefixedVarName(i)}["value"]`)
          .join(", ")}
      ]);
    } else {
      return error('single', { value: 'array' });
    }
  })()`;
};
