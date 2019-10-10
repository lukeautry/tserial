import { assertSuccess } from "../assert-success";
import { deserialize } from "./index-signature.output";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export interface ITestInterface {
  [key: string]: ISubInterface;
  test: ISubInterface;
}

interface ISubInterface {
  value: string;
}

describe("[interface] deserialize with index signature", () => {
  it("should deserialize valid input", () => {
    assertSuccess(
      deserialize("ITestInterface", {
        propOne: { value: "test" },
        propTwo: { value: "test2" },
        test: { value: "test3" }
      }),
      result => {
        expect(result.value).toEqual({
          propOne: { value: "test" },
          propTwo: { value: "test2" },
          test: { value: "test3" }
        });
      }
    );
  });

  it("should not deserialize with wrong value type", () => {
    assertError(
      deserialize("ITestInterface", {
        propOne: 1234
      })
    );
  });

  it("should not deserialize with missing required key", () => {
    assertError(
      deserialize("ITestInterface", {
        propOne: { value: "test" },
        propTwo: { value: "test2" }
      })
    );
  });
});
