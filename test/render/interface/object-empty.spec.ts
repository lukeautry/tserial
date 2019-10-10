import { deserialize } from "./object-empty.output";
import { assertSuccess } from "../assert-success";

/**
 * @serializable
 */
// eslint-disable-next-line
export interface ITestInterface {}

describe("[alias] deserialize object", () => {
  it("should deserialize valid data", () => {
    assertSuccess(deserialize("ITestInterface", {}), result => {
      expect(result.value).toEqual({});
    });
  });
});
