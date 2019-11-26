import { deserialize } from "./tuple.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = [string, number, boolean, null];

describe("[alias] deserialize tuple", () => {
  it("should deserialize tuple", () => {
    assertSuccess(
      deserialize("TypeAlias", ["test", 1234, true, null]),
      value => {
        expect(value.value).toEqual(["test", 1234, true, null]);
      }
    );
  });

  it("should not deserialize tuple with missing value", () => {
    assertError(deserialize("TypeAlias", ["test", 1234, true]));
  });

  it("should not deserialize tuple with wrong value type", () => {
    assertError(
      deserialize("TypeAlias", ["test", "1234", true, null]),
      result => {
        expect(result).toEqual({
          kind: "object-key",
          key: "[1]",
          value: { kind: "single", value: "number" }
        });
      }
    );
  });
});
