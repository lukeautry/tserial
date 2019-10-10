import { runGetMetadata } from "../run";
import { assertStringLiteral, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  stringLiteralProp: "test";
}

it("[interface] string-literal", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertStringLiteral(
      properties.find(p => p.name === "stringLiteralProp"),
      value => {
        expect(value.value).toBe("test");
      }
    );
  });
});
