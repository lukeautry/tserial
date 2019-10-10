import { runGetMetadata } from "../run";
import { assertString, assertObject, assertNumber } from "../guards";

/**
 * @serializable
 */
export type TypeAlias = IGenericInterface<string, number>;

interface IGenericInterface<A, B> {
  valueOne: A;
  valueTwo: B;
}

it("[alias] generic interface", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    assertString(objectValue.properties.find(p => p.name === "valueOne"));
    assertNumber(objectValue.properties.find(p => p.name === "valueTwo"));
  });
});
