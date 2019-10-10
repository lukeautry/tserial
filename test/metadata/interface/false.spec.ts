import { runGetMetadata } from "../run";
import { assertFalse, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  falseProp: false;
}

it("[interface] false", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertFalse(properties.find(p => p.name === "falseProp"));
  });
});
