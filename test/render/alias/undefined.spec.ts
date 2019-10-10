import { deserialize } from "./undefined.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = undefined;

describe("[alias] deserialize undefined", () => {
  it("should deserialize undefined", () => {
    assertSuccess(deserialize("TypeAlias", undefined), result => {
      expect(result.value).toBe(undefined);
    });
  });

  it("should not deserialize null", () => {
    assertError(deserialize("TypeAlias", null));
  });

  it("should not deserialize undefined as string", () => {
    assertError(deserialize("TypeAlias", "undefined"));
  });
});
