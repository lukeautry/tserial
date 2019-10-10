import { runGetMetadata } from "../run";
import { assertObject, assertUnionOf } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  nested: {
    sub: ISubInterface<number>;
  };
}

interface ISubInterface<T> {
  value?: T;
}

it("[interface] nested generic", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertObject(
      properties.find(p => p.name === "nested"),
      nestedObjectValue => {
        assertObject(
          nestedObjectValue.properties.find(p => p.name === "sub"),
          subValue => {
            assertUnionOf(subValue.properties[0], [
              "number",
              "optional",
              "undefined"
            ]);
          }
        );
      }
    );
  });
});
