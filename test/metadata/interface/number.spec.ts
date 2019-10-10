import { runGetMetadata } from "../run";
import { assertNumber, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  numberProp: number;
}

it("[interface] number", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertNumber(properties.find(p => p.name === "numberProp"));
  });
});
