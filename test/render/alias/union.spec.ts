import { deserialize } from "./union.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = "one" | "two" | false | undefined;

describe("[alias] deserialize union type", () => {
  it("should deserialize one", () => {
    assertSuccess(deserialize("TypeAlias", "one"), result => {
      expect(result.value).toBe("one");
    });
  });

  it("should deserialize two", () => {
    assertSuccess(deserialize("TypeAlias", "one"), result => {
      expect(result.value).toBe("one");
    });
  });

  it("should deserialize false", () => {
    assertSuccess(deserialize("TypeAlias", false), result => {
      expect(result.value).toBe(false);
    });
  });

  it("should deserialize undefined", () => {
    assertSuccess(deserialize("TypeAlias", undefined), result => {
      expect(result.value).toBe(undefined);
    });
  });

  it("should not deserialize three", () => {
    assertError(deserialize("TypeAlias", "three"));
  });

  it("should not deserialize true", () => {
    assertError(deserialize("TypeAlias", true), result => {
      expect(result).toEqual({
        success: false,
        kind: "one-of",
        values: [
          { success: false, kind: "single", value: "one" },
          { success: false, kind: "single", value: "two" },
          { success: false, kind: "single", value: false },
          { success: false, kind: "single", value: "undefined" }
        ]
      });
    });
  });
});
