import { ISuccessResult } from "./result";

export const success = <T>(value: T): ISuccessResult<T> => ({
  success: true,
  value
});
