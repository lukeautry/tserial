import { Result } from "./result";
import { success } from "./success";
import { error } from "./error";

export const isNull = (value: unknown): value is null => value === null;

export const assertNull = (value: unknown): Result<null> =>
  isNull(value) ? success(value) : error("single", { value: null });
