import { RootValue } from "../common/types";
import { LINE_BREAK } from "../common/constants";
import { Cache } from "./cache";
import { renderAssert } from "./render-assert";

const deserializersName = "deserializers";
const deserializersTypeName = "Deserializers";

interface IRenderDeserializersParams {
  values: RootValue[];
  cache: Cache;
}

export const renderDeserializers = ({
  values,
  cache
}: IRenderDeserializersParams) => {
  const renderRefAssertions = () => {
    const entries = Object.entries(cache.getRefMap());
    if (entries.length > 0) {
      return `
        const references = {
          ${entries.map(
            ([key, value]) => `'${key}': (value: unknown) => {
            return ${renderAssert({
              name: value.name,
              value,
              varName: "value",
              cache,
              allowCache: false
            })}
          }`
          )}
        };
      `;
    } else {
      return "";
    }
  };

  const content = `
    ${renderRefAssertions()}

    const ${deserializersName} = {
      ${values
        .map(value => {
          return `
            '${value.name}': (value: unknown): Result<${value.name}> => {
            return ${renderAssert({
              name: value.name,
              value,
              varName: "value",
              cache
            })};
          },`;
        })
        .join(LINE_BREAK)}
    };

    type ${deserializersTypeName} = typeof ${deserializersName};

    export const deserialize = <K extends keyof ${deserializersTypeName}>(
      key: K,
      value: unknown
    ): ReturnType<${deserializersTypeName}[K]> =>
      ${deserializersName}[key](value) as ReturnType<${deserializersTypeName}[K]>;
  `;

  return {
    content,
    requiredSnippets: cache.getRequiredSnippets()
  };
};
