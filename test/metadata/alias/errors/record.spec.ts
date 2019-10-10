import { runGetMetadata } from "../../run";
import { ErrorTypes } from "../../../../src/metadata/common/unsupported-error";

/**
 * @serializable
 */
export type TypeAlias = Record<string, number>;

it("[alias] record mapped type", () => {
  expect(() => {
    runGetMetadata(__filename);
  }).toThrowError(ErrorTypes.MAPPED_TYPES_NOT_ALLOWED);
});
