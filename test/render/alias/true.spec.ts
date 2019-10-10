import { deserialize } from "./true.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = true;

describe("[alias] deserialize true", () => {
  it("should deserialize true", () => {
    assertSuccess(deserialize("TypeAlias", true), result => {
      expect(result.value).toBe(true);
    });
  });

  it("should not deserialize false", () => {
    assertError(deserialize("TypeAlias", false));
  });

  it("should not deserialize true as string", () => {
    assertError(deserialize("TypeAlias", "true"));
  });
});
