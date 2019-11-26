import { deserialize } from "./intersection.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = IInterfaceOne & IInterfaceTwo;

interface IInterfaceOne {
  one: string;
}

interface IInterfaceTwo {
  two: number;
}

describe("[alias] deserialize intersection type", () => {
  it("should deserialize", () => {
    assertSuccess(
      deserialize("TypeAlias", {
        one: "test",
        two: 1234
      })
    );
  });

  it("should not deserialize with missing prop", () => {
    assertError(
      deserialize("TypeAlias", {
        one: "test"
      })
    );
  });

  it("should not deserialize with wrong value prop", () => {
    assertError(
      deserialize("TypeAlias", {
        one: "test",
        two: "1234"
      }),
      result => {
        expect(result).toEqual({
          kind: "object-key",
          key: "two",
          value: { kind: "single", value: "number" }
        });
      }
    );
  });
});
