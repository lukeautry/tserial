import { runGetMetadata } from "../run";
import {
  assertString,
  assertObject,
  assertIndex,
  assertNumber
} from "../guards";

/**
 * @serializable
 */
// eslint-disable-next-line
export type TypeAlias = { [key: string]: number };

it("[alias] index signature", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    assertIndex(
      objectValue.properties.find(p => p.name === "TypeAlias"),
      indexValue => {
        assertString(indexValue.key);
        assertNumber(indexValue.value);
      }
    );
  });
});
