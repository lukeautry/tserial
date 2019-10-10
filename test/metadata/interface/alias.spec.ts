import { runGetMetadata } from "../run";
import {
  assertStringLiteral,
  assertNumberLiteral,
  assertString,
  assertBoolean,
  assertNumber,
  assertUnionOf,
  assertIntersection,
  assertObject
} from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  propOne: StringLiteralAlias;
  propTwo: NumericLiteralAlias;
  propThree: StringAlias;
  propFour: BooleanAlias;
  propFive: NumberAlias;
  propSix: StringOrUndefinedAlias;
  propSeven: IntersectionAlias;
  propEight: ObjectLiteralAlias;
  propNine: InterfaceAlias;
}

type StringLiteralAlias = "test";
type NumericLiteralAlias = 1;
type StringAlias = string;
type NumberAlias = number;
type BooleanAlias = boolean;
type StringOrUndefinedAlias = string | undefined;
type IntersectionAlias = { valueOne: string } & { valueTwo: number };

// eslint-disable-next-line
type ObjectLiteralAlias = {
  valueOne: string;
  valueTwo: number;
};

type InterfaceAlias = ISubInterface;

interface ISubInterface {
  valueOne: string;
  valueTwo: number;
}

it("[interface] alias", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(9);

    assertStringLiteral(
      properties.find(p => p.name === "propOne"),
      stringLiteralValue => {
        expect(stringLiteralValue.value).toBe("test");
      }
    );

    assertNumberLiteral(
      properties.find(p => p.name === "propTwo"),
      numericLiteralValue => {
        expect(numericLiteralValue.value).toBe(1);
      }
    );

    assertString(properties.find(p => p.name === "propThree"));

    assertBoolean(properties.find(p => p.name === "propFour"));

    assertNumber(properties.find(p => p.name === "propFive"));

    assertUnionOf(properties.find(p => p.name === "propSix"), [
      "string",
      "undefined"
    ]);

    assertIntersection(
      properties.find(p => p.name === "propSeven"),
      intersectionTypeValue => {
        expect(intersectionTypeValue.values.length).toBe(2);

        assertObject(intersectionTypeValue.values[0], objectValue => {
          assertString(objectValue.properties.find(p => p.name === "valueOne"));
        });

        assertObject(intersectionTypeValue.values[1], objectValue => {
          assertNumber(objectValue.properties.find(p => p.name === "valueTwo"));
        });
      }
    );

    assertObject(properties.find(p => p.name === "propEight"), objectValue => {
      assertString(objectValue.properties.find(p => p.name === "valueOne"));
      assertNumber(objectValue.properties.find(p => p.name === "valueTwo"));
    });

    assertObject(properties.find(p => p.name === "propNine"), objectValue => {
      assertString(objectValue.properties.find(p => p.name === "valueOne"));
      assertNumber(objectValue.properties.find(p => p.name === "valueTwo"));
    });
  });
});
