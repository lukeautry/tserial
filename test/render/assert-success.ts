import { Result, ISuccessResult } from "../../src/assertions/result";

export const assertSuccess = <T>(
  result: Result<T>,
  fn?: (result: ISuccessResult<T>) => void
) => {
  if (result.success) {
    if (fn) {
      return fn(result);
    }

    return;
  } else {
    throw new Error("expected result");
  }
};
