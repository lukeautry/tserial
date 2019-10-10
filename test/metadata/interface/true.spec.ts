import { runGetMetadata } from "../run";
import { assertTrue, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  trueProp: true;
}

it("[interface] true", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertTrue(properties.find(p => p.name === "trueProp"));
  });
});
