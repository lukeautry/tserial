import { runGetMetadata } from "../../run";
import { ErrorTypes } from "../../../../src/metadata/common/unsupported-error";

/**
 * @serializable
 */
export type TypeAlias = Pick<ITestInterface, "one">;

interface ITestInterface {
  one: string;
  two: string;
}

it("[alias] pick mapped type", () => {
  expect(() => {
    runGetMetadata(__filename);
  }).toThrowError(ErrorTypes.MAPPED_TYPES_NOT_ALLOWED);
});
