import { deserialize } from "./null.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = null;

describe("[alias] deserialize null", () => {
  it("should deserialize null", () => {
    assertSuccess(deserialize("TypeAlias", null), result => {
      expect(result.value).toBe(null);
    });
  });

  it("should not deserialize undefined", () => {
    assertError(deserialize("TypeAlias", undefined));
  });

  it("should not deserialize null as string", () => {
    assertError(deserialize("TypeAlias", "null"));
  });
});
