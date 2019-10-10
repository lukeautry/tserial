import { Result } from "./result";
import { success } from "./success";
import { error } from "./error";

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
    : error("single", { value: expected });
