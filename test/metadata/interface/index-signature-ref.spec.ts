import { runGetMetadata } from "../run";
import { assertObject, assertIndex, assertString, assertRef } from "../guards";

/**
 * @serializable
 */
// eslint-disable-next-line
export interface ITestInterface {
  [key: string]: ISubInterface;
  test: ISubInterface;
}

interface ISubInterface {
  value: string;
}

it("[interface] index signature with ref", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    assertIndex(objectValue.properties[0], indexValue => {
      assertObject(indexValue.value, subObjectValue => {
        assertString(subObjectValue.properties[0]);

        assertRef(objectValue.properties[1], refValue => {
          expect(refValue.refId).toEqual(subObjectValue.id);
        });
      });
    });
  });
});
