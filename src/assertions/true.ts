import { Result } from "./result";
import { success } from "./success";
import { error } from "./error";

export const isTrue = (value: unknown): value is true => value === true;

export const assertTrue = (value: unknown): Result<true> =>
  isTrue(value) ? success(value) : error("single", { value: true });
