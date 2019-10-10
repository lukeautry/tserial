import { runGetMetadata } from "../run";
import { assertObject, assertString, assertNumber } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  objectLiteralProp: {
    propOne: string;
    propTwo: number;
  };
}

it("[interface] object-literal", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertObject(
      properties.find(p => p.name === "objectLiteralProp"),
      objectValue => {
        const literalProperties = objectValue.properties;
        expect(literalProperties.length).toBe(2);

        assertString(literalProperties.find(p => p.name === "propOne"));
        assertNumber(literalProperties.find(p => p.name === "propTwo"));
      }
    );
  });
});
