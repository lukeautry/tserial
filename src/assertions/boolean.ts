import { Result } from "./result";
import { success } from "./success";

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

export const assertBoolean = (value: unknown): Result<boolean> =>
  isBoolean(value) ? success(value) : { kind: "single", value: "boolean" };
