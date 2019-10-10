import { runGetMetadata } from "../run";
import { assertObject, assertString } from "../guards";

/**
 * @serializable
 */
export interface IBaseInterface {
  valueOne: string;
}

/**
 * @serializable
 */
export interface ITestInterface extends IBaseInterface {
  valueTwo: string;
}

it("[interface] inheritance from reference", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(2);

  assertObject(values[0], objValue => {
    assertString(objValue.properties.find(p => p.name === "valueOne"));
  });

  assertObject(values[1], objValue => {
    assertString(objValue.properties.find(p => p.name === "valueOne"));
    assertString(objValue.properties.find(p => p.name === "valueTwo"));
  });
});
