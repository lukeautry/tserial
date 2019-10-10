import { runGetMetadata } from "../../run";
import { ErrorTypes } from "../../../../src/metadata/common/unsupported-error";

/**
 * @serializable
 */
export interface ITestInterface {
  funcProp: Function;
}

it("[interface] function keyword should be rejected", () => {
  expect(() => {
    runGetMetadata(__filename);
  }).toThrowError(ErrorTypes.FUNCTION_NOT_ALLOWED);
});
