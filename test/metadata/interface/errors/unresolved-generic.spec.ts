import { runGetMetadata } from "../../run";
import { ErrorTypes } from "../../../../src/metadata/common/unsupported-error";

/**
 * @serializable
 */
export interface ITestInterface<T> {
  value: T;
}

it("[interface] unresolved generic", () => {
  expect(() => {
    runGetMetadata(__filename);
  }).toThrowError(ErrorTypes.UNRESOLVED_GENERIC);
});
