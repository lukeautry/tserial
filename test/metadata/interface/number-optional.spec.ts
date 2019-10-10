import { runGetMetadata } from "../run";
import { assertUnionOf, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  optionalNumberProp?: number;
}

it("[interface] optional number", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertUnionOf(properties.find(p => p.name === "optionalNumberProp"), [
      "number",
      "optional",
      "undefined"
    ]);
  });
});
