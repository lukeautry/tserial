import { runGetMetadata } from "../run";
import { assertEnumMember, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  enumMemberProp: TestEnum.ValueThree;
}

enum TestEnum {
  ValueOne,
  ValueTwo,
  ValueThree
}

it("[interface] enum-member", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertEnumMember(
      properties.find(p => p.name === "enumMemberProp"),
      enumMemberValue => {
        expect(enumMemberValue.value).toBe(2);
      }
    );
  });
});
