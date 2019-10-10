import { deserialize } from "./object.output";
import { assertSuccess } from "../assert-success";
import { assertError } from "../assert-error";

/**
 * @serializable
 */
export interface ITestInterface {
  valueOne: string;
  valueTwo: number;
}

describe("[alias] deserialize object", () => {
  it("should deserialize valid data", () => {
    assertSuccess(
      deserialize("ITestInterface", {
        valueOne: "test",
        valueTwo: 1234
      }),
      result => {
        expect(result.value).toEqual({
          valueOne: "test",
          valueTwo: 1234
        });
      }
    );
  });

  it("should not deserialize data with missing key/value", () => {
    assertError(
      deserialize("ITestInterface", {
        valueOne: "test"
      }),
      result => {
        expect(result).toEqual({
          success: false,
          kind: "keyed",
          key: "valueTwo",
          value: { success: false, kind: "single", value: "to exist" }
        });
      }
    );
  });

  it("should not deserialize data with wrong data type", () => {
    assertError(
      deserialize("ITestInterface", {
        valueOne: "test",
        valueTwo: "not-number"
      }),
      result => {
        expect(result).toEqual({
          success: false,
          kind: "keyed",
          key: "valueTwo",
          value: { success: false, kind: "single", value: "number" }
        });
      }
    );
  });
});
