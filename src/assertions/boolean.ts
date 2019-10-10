import { Result } from "./result";
import { success } from "./success";
import { error } from "./error";

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

export const assertBoolean = (value: unknown): Result<boolean> =>
  isBoolean(value) ? success(value) : error("single", { value: "boolean" });
