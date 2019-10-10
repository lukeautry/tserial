import { runGetMetadata } from "../run";
import {
  assertString,
  assertUnion,
  assertRef,
  assertObject,
  assertOptional
} from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  value: string;
  child?: ITestInterface;
}

it("[interface] self referenced interface", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties, id } = objectValue;
    expect(properties.length).toBe(2);

    assertString(properties.find(p => p.name === "value"));
    assertUnion(properties.find(p => p.name === "child"), unionTypeValue => {
      expect(unionTypeValue.values.length).toBe(3);
      assertRef(unionTypeValue.values[0], refVal => {
        expect(refVal.refId).toBe(id);
      });
      assertOptional(unionTypeValue.values[1]);
    });

    // make sure there's not a circular reference; JSON.stringify will catch this
    expect(!!JSON.stringify(objectValue));
  });
});
