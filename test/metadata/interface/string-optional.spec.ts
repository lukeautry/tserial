import { runGetMetadata } from "../run";
import { assertUnionOf, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  optionalStringProp?: string;
}

it("[interface] optional string", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertUnionOf(properties.find(p => p.name === "optionalStringProp"), [
      "string",
      "optional",
      "undefined"
    ]);
  });
});
