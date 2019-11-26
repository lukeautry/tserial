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
        kind: "one-of",
        values: [
          { kind: "single", value: "one" },
          { kind: "single", value: "two" },
          { kind: "single", value: false },
          { kind: "single", value: "undefined" }
        ]
      });
    });
  });
});
