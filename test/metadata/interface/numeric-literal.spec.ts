import { runGetMetadata } from "../run";
import { assertNumberLiteral, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  numberLiteralProp: 1234;
}

it("[interface] numeric-literal", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertNumberLiteral(
      properties.find(p => p.name === "numberLiteralProp"),
      numericLiteralValue => {
        expect(numericLiteralValue.value).toBe(1234);
      }
    );
  });
});
