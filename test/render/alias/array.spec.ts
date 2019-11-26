import { deserialize } from "./array.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = string[];

describe("[alias] deserialize string array", () => {
  it("should deserialize string array", () => {
    assertSuccess(deserialize("TypeAlias", ["test", "two"]), result => {
      expect(result.value).toEqual(["test", "two"]);
    });
  });

  it("should deserialize empty array", () => {
    assertSuccess(deserialize("TypeAlias", []), result => {
      expect(result.value).toEqual([]);
    });
  });

  it("should not deserialize array with non string", () => {
    assertError(deserialize("TypeAlias", ["one", 1]), result => {
      expect(result).toEqual({
        kind: "object-key",
        key: "[1]",
        value: { kind: "single", value: "string" }
      });
    });
  });
});
