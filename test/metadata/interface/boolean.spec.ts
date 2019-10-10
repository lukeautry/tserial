import { runGetMetadata } from "../run";
import { assertBoolean, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  booleanProp: boolean;
}

it("[interface] boolean", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertBoolean(properties.find(p => p.name === "booleanProp"));
  });
});
