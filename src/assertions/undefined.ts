import { Result } from "./result";
import { success } from "./success";
import { error } from "./error";

export const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined";

export const assertUndefined = (value: unknown): Result<undefined> =>
  isUndefined(value) ? success(value) : error("single", { value: "undefined" });
