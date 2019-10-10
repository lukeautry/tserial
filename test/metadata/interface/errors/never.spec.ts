import { runGetMetadata } from "../../run";
import { ErrorTypes } from "../../../../src/metadata/common/unsupported-error";

/**
 * @serializable
 */
export interface ITestInterface {
  neverProp: never;
}

it("[interface] never keyword should be rejected", () => {
  expect(() => {
    runGetMetadata(__filename);
  }).toThrowError(ErrorTypes.NEVER_NOT_ALLOWED);
});
