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
export interface ITestInterface {
  [key: string]: number;
}

it("[interface] index signature", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    assertIndex(
      objectValue.properties.find(p => p.name === "ITestInterface"),
      indexValue => {
        assertString(indexValue.key);
        assertNumber(indexValue.value);
      }
    );
  });
});
