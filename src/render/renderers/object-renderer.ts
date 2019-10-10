import { renderAssert } from "../render-assert";
import { IRenderParams } from "./common/render-params";

export const objectRenderer: (params: IRenderParams<"object">) => string = ({
  cache,
  varName,
  value
}) => {
  cache.includeSnippet(
    "object",
    value.properties.length ? "key-value" : "success",
    "error"
  );
  const prefix = cache.getPrefix();
  const prefixedVarName = (index: number) => `${prefix}${index}`;
  return `(() => {
      if (!isObject(${varName})) {
        return error('single', { value: 'object' });
      }

      ${value.properties
        .map((p, i) => {
          const lastPropVarName = (refValue: boolean) =>
            i === 0
              ? varName
              : `${prefixedVarName(i - 1)}${refValue ? ".value" : ""}`;
          const propVarName = prefixedVarName(i);
          const paramName = `${cache.getPrefix()}v`;

          if (p.type === "index") {
            cache.includeSnippet("record");
            return `
              const ${propVarName} = assertRecord(${lastPropVarName(
              true
            )}, ${paramName} => ${renderAssert({
              name: p.name,
              value: p.value,
              varName: paramName,
              cache
            })});
              if (!${propVarName}.success) { return ${propVarName}; }
            `;
          } else {
            const assertKeyScript = `
              assertKeyValue(${lastPropVarName(true)}, '${
              p.name
            }', ${paramName} => ${renderAssert({
              name: p.name,
              // we don't actually want to process optional types through renderer; we're handling it at this layer
              value:
                p.type === "union"
                  ? {
                      ...p,
                      values: p.values.filter(v => v.type !== "optional")
                    }
                  : p,
              varName: paramName,
              cache
            })})`;

            const errorCheckScript = `
              if (!${propVarName}.success) {
                return error('keyed', {
                  key: '${p.name}',
                  value: ${propVarName}
                });
              }
            `;

            return p.type === "union" &&
              p.values.some(p => p.type === "optional")
              ? `
                const ${propVarName} = hasKey(${lastPropVarName(true)}, '${
                  p.name
                }') ? ${assertKeyScript} : ${lastPropVarName(false)};
                ${errorCheckScript}
              `
              : `
                const ${propVarName} = ${assertKeyScript}
                ${errorCheckScript}
              `;
          }
        })
        .join("\r\n")}

        return ${
          value.properties.length > 0
            ? prefixedVarName(value.properties.length - 1)
            : `success(${varName})`
        };
    })()`;
};
