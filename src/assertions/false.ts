import { Result } from "./result";
import { success } from "./success";

export const isFalse = (value: unknown): value is false => value === false;

export const assertFalse = (value: unknown): Result<false> =>
  isFalse(value) ? success(value) : { kind: "single", value: false };
