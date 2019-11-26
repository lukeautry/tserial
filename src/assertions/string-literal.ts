import { Result } from "./result";
import { success } from "./success";

const isStringLiteral = <K extends string>(
  value: unknown,
  expected: K
): value is K => {
  return value === expected;
};

export const assertStringLiteral = <K extends string>(
  value: unknown,
  expected: K
): Result<K> =>
  isStringLiteral(value, expected)
    ? success(value)
    : { kind: "single", value: expected };
