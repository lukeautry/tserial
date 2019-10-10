import { runGetMetadata } from "../../run";
import { ErrorTypes } from "../../../../src/metadata/common/unsupported-error";

/**
 * @serializable
 */
export interface ITestInterface {
  voidProp: void;
}

it("[interface] void keyword should be rejected", () => {
  expect(() => {
    runGetMetadata(__filename);
  }).toThrowError(ErrorTypes.VOID_NOT_ALLOWED);
});
