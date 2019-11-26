import { getEscaped } from "./common/get-escaped";
import { IRenderParams } from "./common/render-params";

export const enumRenderer: (params: IRenderParams<"enum">) => string = ({
  cache,
  value,
  name
}) => {
  if (value.values.length > 0) {
    cache.includeSnippet("success");
  }
  return `(() => {
    const arr = [${value.values.map(v => getEscaped(v))}];
    for (const v of arr) {
      if (v === value) {
        return success(v as ${name});
      }
    }

    return {
      kind: 'one-of',
      values: [${value.values
        .map(v => `{ kind: 'single', value: ${getEscaped(v)} }`)
        .join(",")}]
    } as const;
  })()`;
};
