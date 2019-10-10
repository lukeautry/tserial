import { deserialize } from "./numeric-literal.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = 1234;

describe("[alias] deserialize numeric literal", () => {
  it("should deserialize valid literal", () => {
    assertSuccess(deserialize("TypeAlias", 1234), result => {
      expect(result.value).toBe(1234);
    });
  });

  it("should not deserialize invalid literal", () => {
    assertError(deserialize("TypeAlias", 12345));
  });
});
