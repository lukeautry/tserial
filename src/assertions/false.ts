import { Result } from "./result";
import { success } from "./success";
import { error } from "./error";

export const isFalse = (value: unknown): value is false => value === false;

export const assertFalse = (value: unknown): Result<false> =>
  isFalse(value) ? success(value) : error("single", { value: false });
