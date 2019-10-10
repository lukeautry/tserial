import { runGetMetadata } from "../run";
import {
  assertObject,
  assertStringLiteral,
  assertNumberLiteral
} from "../guards";

const objectLiteral = {
  valueOne: "test",
  valueTwo: 1234
} as const;

/**
 * @serializable
 */
export type TypeAlias = typeof objectLiteral;

it("[alias] typeof object literal const", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], ({ properties }) => {
    assertStringLiteral(
      properties.find(p => p.name === "valueOne"),
      stringLiteralValue => {
        expect(stringLiteralValue.value).toBe("test");
      }
    );

    assertNumberLiteral(
      properties.find(p => p.name === "valueTwo"),
      numberLiteralValue => {
        expect(numberLiteralValue.value).toBe(1234);
      }
    );
  });
});
