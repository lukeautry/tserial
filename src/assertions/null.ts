import { Result } from "./result";
import { success } from "./success";

export const isNull = (value: unknown): value is null => value === null;

export const assertNull = (value: unknown): Result<null> =>
  isNull(value) ? success(value) : { kind: "single", value: null };
