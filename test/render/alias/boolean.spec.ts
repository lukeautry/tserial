import { deserialize } from "./boolean.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = boolean;

describe("[alias] deserialize boolean", () => {
  it("should deserialize true", () => {
    assertSuccess(deserialize("TypeAlias", true), result => {
      expect(result.value).toBe(true);
    });
  });

  it("should deserialize false", () => {
    assertSuccess(deserialize("TypeAlias", false), result => {
      expect(result.value).toBe(false);
    });
  });

  it("should not deserialize number as string", () => {
    assertError(deserialize("TypeAlias", "false"));
  });
});
