import { Result } from "./result";
import { success } from "./success";

const isNumericLiteral = <N extends number>(
  value: unknown,
  expected: N
): value is N => {
  return value === expected;
};

export const assertNumericLiteral = <N extends number>(
  value: unknown,
  expected: N
): Result<N> =>
  isNumericLiteral(value, expected)
    ? success(value)
    : { kind: "single", value: expected };
