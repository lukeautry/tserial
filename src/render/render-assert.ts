import { TypeScriptValue } from "../common/types";
import { Cache } from "./cache";
import { renderers } from "./renderers";

interface IRenderAssertParams {
  name: string;
  value: TypeScriptValue;
  varName: string;
  cache: Cache;
  allowCache?: boolean;
}

export const renderAssert = ({
  name,
  value,
  varName,
  cache,
  allowCache = true
}: IRenderAssertParams): string => {
  if (allowCache && cache.getRefMap()[value.id]) {
    return `references['${value.id}'](${varName})`;
  }

  return renderers[value.type]({
    cache,
    name,
    varName,
    // TypeScript mapped types will take care of this since we can trust the input
    // eslint-disable-next-line
    value: value as any
  });
};
