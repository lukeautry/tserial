import { runGetMetadata } from "../run";
import { assertUnion, assertStringLiteral } from "../guards";

/**
 * @serializable
 */
export type TypeAlias = keyof IKeyedInterface;

interface IKeyedInterface {
  one: string;
  two: number;
}

it("[alias] keyof", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertUnion(values[0], unionTypeValue => {
    expect(unionTypeValue.values.length).toBe(2);
    assertStringLiteral(unionTypeValue.values[0], stringLiteralValue => {
      expect(stringLiteralValue.value).toBe("one");
    });
    assertStringLiteral(unionTypeValue.values[1], stringLiteralValue => {
      expect(stringLiteralValue.value).toBe("two");
    });
  });
});
