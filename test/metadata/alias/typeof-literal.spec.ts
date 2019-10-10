import { runGetMetadata } from "../run";
import { assertObject, assertString } from "../guards";

const objectLiteral = { value: "test" };

/**
 * @serializable
 */
export type TypeAlias = typeof objectLiteral;

it("[alias] typeof object literal", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    assertString(objectValue.properties.find(p => p.name === "value"));
  });
});
