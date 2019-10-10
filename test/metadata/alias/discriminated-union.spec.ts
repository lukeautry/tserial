import { runGetMetadata } from "../run";
import {
  assertUnion,
  assertObject,
  assertStringLiteral,
  assertString,
  assertNumber
} from "../guards";

/**
 * @serializable
 */
export type TypeAlias = IFirst | ISecond;

interface IFirst {
  type: "first";
  value: string;
}

interface ISecond {
  type: "second";
  value: number;
}

it("[alias] discriminated union", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertUnion(values[0], unionTypeValue => {
    assertObject(unionTypeValue.values[0], objectValue => {
      assertStringLiteral(
        objectValue.properties.find(p => p.name === "type"),
        literalValue => {
          expect(literalValue.value).toBe("first");
        }
      );
      assertString(objectValue.properties.find(p => p.name === "value"));
    });

    assertObject(unionTypeValue.values[1], objectValue => {
      assertStringLiteral(
        objectValue.properties.find(p => p.name === "type"),
        literalValue => {
          expect(literalValue.value).toBe("second");
        }
      );
      assertNumber(objectValue.properties.find(p => p.name === "value"));
    });
  });
});
