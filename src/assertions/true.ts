import { Result } from "./result";
import { success } from "./success";

export const isTrue = (value: unknown): value is true => value === true;

export const assertTrue = (value: unknown): Result<true> =>
  isTrue(value) ? success(value) : { kind: "single", value: true };
