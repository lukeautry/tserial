import { Result } from "./result";
import { success } from "./success";
import { error } from "./error";

export const isString = (value: unknown): value is string =>
  typeof value === "string";

export const assertString = (value: unknown): Result<string> =>
  isString(value) ? success(value) : error("single", { value: "string" });
