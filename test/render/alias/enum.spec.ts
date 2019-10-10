import { deserialize } from "./enum.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = MyEnum;

export enum MyEnum {
  First,
  Two = "two",
  Three = 3
}

describe("[alias] deserialize enum", () => {
  it("should deserialize First (0)", () => {
    assertSuccess(deserialize("TypeAlias", 0), result => {
      expect(result.value).toBe(0);
    });
  });

  it("should deserialize First (as enum)", () => {
    assertSuccess(deserialize("TypeAlias", MyEnum.First), result => {
      expect(result.value).toBe(0);
    });
  });

  it("should deserialize 'two'", () => {
    assertSuccess(deserialize("TypeAlias", "two"), result => {
      expect(result.value).toBe("two");
    });
  });

  it("should deserialize 3", () => {
    assertSuccess(deserialize("TypeAlias", 3), result => {
      expect(result.value).toBe(3);
    });
  });

  it("should not deserialize non value", () => {
    assertError(deserialize("TypeAlias", 1));
  });
});
