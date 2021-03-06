import { getEscaped } from "./common/get-escaped";
import { IRenderParams } from "./common/render-params";

export const enumMemberRenderer: (
  params: IRenderParams<"enum-member">
) => string = ({ cache, value, name, varName }) => {
  cache.includeSnippet("success");

  const escapedVal = getEscaped(value.value);
  return `(() => {
    if (${varName} === ${escapedVal}) {
      return success(${varName} as ${name});
    } else {
      return { kind: 'single', value: ${escapedVal} } as const;
    }
  })()`;
};
