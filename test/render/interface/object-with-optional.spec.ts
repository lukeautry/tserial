import { assertSuccess } from "../assert-success";
import { deserialize } from "./object-with-optional.output";

/**
 * @serializable
 */
// eslint-disable-next-line
export interface ITestInterface {
  propOne: string;
  propTwo?: number;
}

describe("[alias] deserialize object", () => {
  it("should deserialize complete data", () => {
    const data = {
      propOne: "test",
      propTwo: 1234
    };
    assertSuccess(deserialize("ITestInterface", data), result => {
      expect(result.value).toEqual(data);
    });
  });

  it("should deserialize with missing optional prop", () => {
    assertSuccess(
      deserialize("ITestInterface", {
        propOne: "test"
      }),
      result => {
        expect(result.value).toEqual({
          propOne: "test"
        });
      }
    );
  });

  /**
   * This is basically a design decision that I could see going either way.
   */
  it("should deserialize with prop undefined", () => {
    assertSuccess(
      deserialize("ITestInterface", {
        propOne: "test",
        propTwo: undefined
      }),
      result => {
        expect(result.value).toEqual({
          propOne: "test",
          propTwo: undefined
        });
      }
    );
  });
});
