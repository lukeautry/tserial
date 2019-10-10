import { deserialize } from "./tagged-union.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export type TypeAlias = IInterfaceOne | IInterfaceTwo | IInterfaceThree;

interface IInterfaceOne {
  kind: "one";
  value: string;
}

interface IInterfaceTwo {
  kind: "two";
  value: number;
}

interface IInterfaceThree {
  kind: "three";
  value: true;
}

describe("[alias] deserialize true", () => {
  it("should deserialize first interface", () => {
    assertSuccess(
      deserialize("TypeAlias", {
        kind: "one",
        value: "test"
      }),
      result => {
        expect(result.value).toEqual({
          kind: "one",
          value: "test"
        });
      }
    );
  });

  it("should deserialize second interface", () => {
    assertSuccess(
      deserialize("TypeAlias", {
        kind: "two",
        value: 1234
      }),
      result => {
        expect(result.value).toEqual({
          kind: "two",
          value: 1234
        });
      }
    );
  });

  it("should deserialize third interface", () => {
    assertSuccess(
      deserialize("TypeAlias", {
        kind: "three",
        value: true
      }),
      result => {
        expect(result.value).toEqual({
          kind: "three",
          value: true
        });
      }
    );
  });

  it("should not deserialize non-matching interface", () => {
    assertError(
      deserialize("TypeAlias", {
        kind: "three_",
        value: true
      })
    );
  });
});
