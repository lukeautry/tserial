import { runGetMetadata } from "../../run";
import { ErrorTypes } from "../../../../src/metadata/common/unsupported-error";

/**
 * @serializable
 */
export interface ITestInterface {
  classProp: TestClass;
}

class TestClass {}

it("[interface] class should be rejected", () => {
  expect(() => {
    runGetMetadata(__filename);
  }).toThrowError(ErrorTypes.CLASS_NOT_ALLOWED);
});
