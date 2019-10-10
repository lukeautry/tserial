import { runGetMetadata } from "../run";
import { assertString, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  stringProp: string;
}

it("[interface] string", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertString(properties.find(p => p.name === "stringProp"));
  });
});
