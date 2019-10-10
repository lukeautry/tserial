import { runGetMetadata } from "../run";
import { assertString, assertObject } from "../guards";

/**
 * @serializable
 */
export type TypeAlias = IGenericInterface;

interface IGenericInterface<A = string> {
  valueOne: A;
}

it("[alias] generic interface with default type", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    assertString(objectValue.properties.find(p => p.name === "valueOne"));
  });
});
