import { runGetMetadata } from "../../run";
import { ErrorTypes } from "../../../../src/metadata/common/unsupported-error";

/**
 * @serializable
 */
export interface ITestInterface {
  unknownProp: unknown;
}

it("[interface] unknown keyword should be rejected", () => {
  expect(() => {
    runGetMetadata(__filename);
  }).toThrowError(ErrorTypes.UNKNOWN_NOT_ALLOWED);
});
