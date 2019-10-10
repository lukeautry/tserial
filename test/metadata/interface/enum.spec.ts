import { runGetMetadata } from "../run";
import { assertEnum, assertObject } from "../guards";

/**
 * @serializable
 */
export interface ITestInterface {
  enumProp: TestEnum;
}

enum TestEnum {
  ValueOne = 3,
  ValueTwo,
  ValueFour = "test",
  // make sure the same value doesn't get pushed in twice
  ValueFive = "test"
}

it("[interface] enum", () => {
  const { values } = runGetMetadata(__filename);
  expect(values.length).toBe(1);

  assertObject(values[0], objectValue => {
    const { properties } = objectValue;
    expect(properties.length).toBe(1);

    assertEnum(properties.find(p => p.name === "enumProp"), enumValue => {
      expect(enumValue.values.length).toBe(3);

      const expectedValues = [3, 4, "test"];
      expectedValues.forEach(val => {
        expect(enumValue.values.includes(val));
      });
    });
  });
});
