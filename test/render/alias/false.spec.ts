import { deserialize } from "./false.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = false;

describe("[alias] deserialize false", () => {
  it("should deserialize false", () => {
    assertSuccess(deserialize("TypeAlias", false), result => {
      expect(result.value).toBe(false);
    });
  });

  it("should not deserialize true", () => {
    assertError(deserialize("TypeAlias", true));
  });

  it("should not deserialize false as string", () => {
    assertError(deserialize("TypeAlias", "false"));
  });
});
