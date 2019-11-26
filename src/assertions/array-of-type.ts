import { Result, Expected } from "./result";
import { success } from "./success";
import { isArray } from "./array";

type ArrayScanResult<T> = IArrayScanSuccess<T> | Expected;

interface IArrayScanSuccess<T> {
  kind: "success";
  values: T[];
}

const scanArrayForType = <T>(
  values: unknown[],
  fn: (ele: unknown) => Result<T>
): ArrayScanResult<T> => {
  for (let index = 0; index < values.length; index++) {
    const result = fn(values[index]);
    if (result.kind !== "success") {
      return {
        kind: "object-key",
        key: `[${index}]`,
        value: result
      };
    }
  }

  return { kind: "success", values: values as T[] };
};

export const assertArrayOfType = <T>(
  value: unknown,
  fn: (ele: unknown) => Result<T>
): Result<T[]> => {
  if (isArray(value)) {
    const scanResult = scanArrayForType(value, fn);
    if (scanResult.kind === "success") {
      return success(scanResult.values);
    } else {
      return scanResult;
    }
  } else {
    return {
      kind: "single",
      value: "array"
    };
  }
};
