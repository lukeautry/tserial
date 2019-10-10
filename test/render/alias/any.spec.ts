import { deserialize } from "./any.output";
import { assertSuccess } from "../assert-success";

/**
 * @serializable
 */
// eslint-disable-next-line
export type TypeAlias = any;

describe("[alias] deserialize any", () => {
  it("should deserialize anything", () => {
    assertSuccess(deserialize("TypeAlias", true), result => {
      expect(result.value).toBe(true);
    });
  });
});
