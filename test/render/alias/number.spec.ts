import { deserialize } from "./number.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = number;

describe("[alias] deserialize number", () => {
  it("should deserialize valid number", () => {
    assertSuccess(deserialize("TypeAlias", 1234), result => {
      expect(result.value).toBe(1234);
    });
  });

  it("should deserialize zero", () => {
    assertSuccess(deserialize("TypeAlias", 0), result => {
      expect(result.value).toBe(0);
    });
  });

  it("should not deserialize number as string", () => {
    assertError(deserialize("TypeAlias", "1234"));
  });
});
