import { deserialize } from "./enum-member.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = MyEnum.Two;

export enum MyEnum {
  First,
  Two = "two"
}

describe("[alias] deserialize enum", () => {
  it("should deserialize 'two'", () => {
    assertSuccess(deserialize("TypeAlias", "two"), result => {
      expect(result.value).toBe("two");
    });
  });

  it("should deserialize MyEnum.Two", () => {
    assertSuccess(deserialize("TypeAlias", MyEnum.Two), result => {
      expect(result.value).toBe(MyEnum.Two);
    });
  });

  it("should not deserialize 0", () => {
    assertError(deserialize("TypeAlias", 0));
  });

  it("should not deserialize First", () => {
    assertError(deserialize("TypeAlias", MyEnum.First));
  });
});
