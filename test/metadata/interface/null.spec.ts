import { runGetMetadata } from "../run";
import { assertNull, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  nullProp: null;
}

it("[interface] null", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertNull(properties.find(p => p.name === "nullProp"));
  });
});
