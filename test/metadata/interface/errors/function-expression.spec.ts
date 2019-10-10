import { runGetMetadata } from "../../run";
import { ErrorTypes } from "../../../../src/metadata/common/unsupported-error";

/**
 * @serializable
 */
export interface ITestInterface {
  funcProp: () => void;
}

it("[interface] function expression", () => {
  expect(() => {
    runGetMetadata(__filename);
  }).toThrowError(ErrorTypes.FUNCTION_NOT_ALLOWED);
});
