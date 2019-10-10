import { runGetMetadata } from "../run";
import { assertUnion, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  numericLiteralUnionType: 10 | 20 | 30;
}

it("[interface] numeric literal union", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertUnion(
      properties.find(p => p.name === "numericLiteralUnionType"),
      ({ values }) => {
        expect(values.length).toBe(3);

        const expectedValues = [10, 20, 30];
        expectedValues.forEach(value => {
          expect(
            values.some(v => v.type === "numeric-literal" && v.value === value)
          );
        });
      }
    );
  });
});
