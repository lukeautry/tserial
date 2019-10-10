import { runGetMetadata } from "../run";
import {
  assertObject,
  assertString,
  assertUnion,
  assertIntersection,
  assertRef,
  assertOptional
} from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  sub: ISubInterface;
}

interface ISubInterface {
  child?: ISubInterface;
}

interface ISubInterface {
  okay: string;
}

it("[interface] self referenced interface with multiple declarations", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertIntersection(
      properties.find(p => p.name === "sub"),
      intersectionTypeValue => {
        expect(intersectionTypeValue.values.length).toBe(2);

        assertObject(intersectionTypeValue.values[0], withChildObjectValue => {
          assertUnion(
            withChildObjectValue.properties.find(p => p.name === "child"),
            unionTypeValue => {
              assertRef(unionTypeValue.values[0], refValue => {
                expect(refValue.refId).toBe(intersectionTypeValue.id);
              });
              assertOptional(unionTypeValue.values[1]);
            }
          );
        });

        assertObject(intersectionTypeValue.values[1], objectValue => {
          assertString(objectValue.properties.find(p => p.name === "okay"));
        });
      }
    );

    // make sure there's not a circular reference; JSON.stringify will catch this
    expect(!!JSON.stringify(objectValue));
  });
});
