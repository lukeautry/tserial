import { deserialize } from "./string-literal.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = "one";

describe("[alias] deserialize string literal", () => {
  it("should deserialize valid literal", () => {
    assertSuccess(deserialize("TypeAlias", "one"), result => {
      expect(result.value).toBe("one");
    });
  });

  it("should not deserialize invalid literal", () => {
    assertError(deserialize("TypeAlias", "one_"));
  });
});
