import { runGetMetadata } from "../run";
import {
  assertIntersection,
  assertString,
  assertNumber,
  assertObject,
  assertStringLiteral
} from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  intersectionProp: { propOne: string; literal: "test" } & { propTwo: number };
}

it("[interface] object literal intersection", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertIntersection(
      properties.find(p => p.name === "intersectionProp"),
      intersectionTypeValue => {
        expect(intersectionTypeValue.values.length).toBe(2);
        assertObject(intersectionTypeValue.values[0], objectValue => {
          assertString(objectValue.properties.find(p => p.name === "propOne"));
          assertStringLiteral(
            objectValue.properties.find(p => p.name === "literal"),
            stringLiteralValue => {
              expect(stringLiteralValue.value).toBe("test");
            }
          );
        });
        assertObject(intersectionTypeValue.values[1], objectValue => {
          assertNumber(objectValue.properties.find(p => p.name === "propTwo"));
        });
      }
    );
  });
});
