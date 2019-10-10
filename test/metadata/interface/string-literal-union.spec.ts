import { runGetMetadata } from "../run";
import { assertUnion, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  stringLiteralUnionType: "one" | "two" | "three";
}

it("[interface] string literal union", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertUnion(
      properties.find(p => p.name === "stringLiteralUnionType"),
      ({ values }) => {
        expect(values.length).toBe(3);

        const expectedValues = ["one", "two", "three"];
        expectedValues.forEach(value => {
          expect(
            values.some(v => v.type === "string-literal" && v.value === value)
          );
        });
      }
    );
  });
});
