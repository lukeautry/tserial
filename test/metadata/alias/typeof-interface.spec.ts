import { runGetMetadata } from "../run";
import { assertObject, assertString } from "../guards";

const interfaceInstance: ITestInterface = { value: "" };

/**
 * @serializable
 */
export type TypeAlias = typeof interfaceInstance;

interface ITestInterface {
  value: string;
}

it("[alias] typeof interface", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    assertString(objectValue.properties.find(p => p.name === "value"));
  });
});
