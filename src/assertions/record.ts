import { Result } from "./result";
import { hasKey } from "./has-key";
import { success } from "./success";
import { error } from "./error";

export const assertRecord = <O extends {}, T>(
  value: O,
  assertFn: (val: unknown) => Result<T>
): Result<O & Record<string, T>> => {
  const objKeys = Object.keys(value);
  for (const key of objKeys) {
    if (hasKey(value, key)) {
      const objVal = value[key];
      const result = assertFn(objVal);
      if (!result.success) {
        return result;
      }
    } else {
      return error("keyed", { key, value });
    }
  }

  return success(value as O & Record<string, T>);
};
