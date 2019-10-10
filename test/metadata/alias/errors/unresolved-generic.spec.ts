import { runGetMetadata } from "../../run";
import { ErrorTypes } from "../../../../src/metadata/common/unsupported-error";

/**
 * @serializable
 */
export type TypeAlias<T> = T;

it("[alias] unresolved generic", () => {
  expect(() => {
    runGetMetadata(__filename);
  }).toThrowError(ErrorTypes.UNRESOLVED_GENERIC);
});
