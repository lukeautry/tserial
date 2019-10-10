import { runGetMetadata } from "../run";
import { assertObject, assertArray, assertString } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  stringArrayBrackets: string[];
  // eslint-disable-next-line
  stringArrayGeneric: Array<string>;
  // eslint-disable-next-line
  stringArrayGenericReadonly: ReadonlyArray<string>;
}

it("[interface] array", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(3);

    assertArray(
      properties.find(p => p.name === "stringArrayBrackets"),
      arrayValue => {
        assertString(arrayValue.value);
      }
    );

    assertArray(
      properties.find(p => p.name === "stringArrayGeneric"),
      arrayValue => {
        assertString(arrayValue.value);
      }
    );

    assertArray(
      properties.find(p => p.name === "stringArrayGenericReadonly"),
      arrayValue => {
        assertString(arrayValue.value);
      }
    );
  });
});
