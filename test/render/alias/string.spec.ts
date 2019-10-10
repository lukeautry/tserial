import { deserialize } from "./string.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = string;

describe("[alias] deserialize string", () => {
  it("should deserialize valid string", () => {
    assertSuccess(deserialize("TypeAlias", "test"), result => {
      expect(result.value).toBe("test");
    });
  });

  it("should deserialize empty string", () => {
    assertSuccess(deserialize("TypeAlias", ""), result => {
      expect(result.value).toBe("");
    });
  });

  it("should not deserialize number", () => {
    assertError(deserialize("TypeAlias", 1));
  });
});
