import { runGetMetadata } from "../run";
import { assertString } from "../guards";

/**
 * @serializable
 */
export type TypeAlias = string;

it("[alias] untagged", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertString(values[0]);
});
