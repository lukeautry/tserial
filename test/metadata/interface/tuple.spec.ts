import { runGetMetadata } from "../run";
import {
  assertObject,
  assertTuple,
  assertString,
  assertNumber
} from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  singleString: [string];
  stringAndNumber: [string, number];
  empty: [];
}

it("[interface] tuple", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(3);

    assertTuple(properties.find(p => p.name === "singleString"), tupleValue => {
      expect(tupleValue.values.length).toBe(1);
      assertString(tupleValue.values[0]);
    });

    assertTuple(
      properties.find(p => p.name === "stringAndNumber"),
      tupleValue => {
        expect(tupleValue.values.length).toBe(2);
        assertString(tupleValue.values[0]);
        assertNumber(tupleValue.values[1]);
      }
    );

    assertTuple(properties.find(p => p.name === "empty"), tupleValue => {
      expect(tupleValue.values.length).toBe(0);
    });
  });
});
