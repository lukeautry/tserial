import { runGetMetadata } from "../run";
import { assertString, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface extends IBaseInterface {
  valueOne: string;
}

interface IBaseInterface extends IThirdInterface {
  valueTwo: string;
}

interface IThirdInterface {
  valueThree: string;
}

it("[interface] inheritance", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(3);

    assertString(properties.find(p => p.name === "valueOne"));
    assertString(properties.find(p => p.name === "valueTwo"));
    assertString(properties.find(p => p.name === "valueThree"));
  });
});
