import { Result } from "./result";
import { success } from "./success";

export const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined";

export const assertUndefined = (value: unknown): Result<undefined> =>
  isUndefined(value) ? success(value) : { kind: "single", value: "undefined" };
