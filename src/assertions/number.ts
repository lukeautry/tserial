import { Result } from "./result";
import { success } from "./success";
import { error } from "./error";

export const isNumber = (value: unknown): value is number =>
  typeof value === "number";

export const assertNumber = (value: unknown): Result<number> =>
  isNumber(value) ? success(value) : error("single", { value: "number" });
