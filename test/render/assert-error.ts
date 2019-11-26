import { Result, Expected } from "../../src/assertions/result";

export const assertError = <T>(
  result: Result<T>,
  fn?: (result: Expected) => void
) => {
  if (result.kind !== "success") {
    if (fn) {
      return fn(result);
    }

    return;
  } else {
    throw new Error("expected error");
  }
};
