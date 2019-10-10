import { runGetMetadata } from "../run";
import { assertObject, assertNumber } from "../guards";

const interfaceInstance: ITestInterface<number> = { value: 1234 };

/**
 * @serializable
 */
export type TypeAlias = typeof interfaceInstance;

interface ITestInterface<T> {
  value: T;
}

it("[alias] typeof interface generic", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    assertNumber(objectValue.properties.find(p => p.name === "value"));
  });
});
