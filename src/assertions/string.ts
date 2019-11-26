import { Result } from "./result";
import { success } from "./success";

export const isString = (value: unknown): value is string =>
  typeof value === "string";

export const assertString = (value: unknown): Result<string> =>
  isString(value) ? success(value) : { kind: "single", value: "string" };
