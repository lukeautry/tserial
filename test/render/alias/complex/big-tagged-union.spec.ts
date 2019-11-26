import { deserialize } from "./big-tagged-union.output";
import { assertSuccess } from "../../assert-success";
import { assertError } from "../../assert-error";

/**
 * @serializable
 */
export type TestAlias = IFirstInterface | ISecondInterface;

/**
 * @serializable
 */
export interface IFirstInterface {
  type: "first";
  propOne: string;
  propTwo: number;
  propThree: "okay";
  propFour: 1234;
}

/**
 * @serializable
 */
export interface ISecondInterface {
  type: "second";
  propFive: {
    subOne: string;
    subTwo: "yes" | "no";
    subThree: 1 | 2 | 5 | 6;
  };
  propSix: ISecondInterfaceSub & {
    subFour: "sub four";
  };
}

interface ISecondInterfaceSub {
  propSeven: string;
}

describe("[alias] big tagged union", () => {
  const validFirstData: IFirstInterface = {
    type: "first",
    propOne: "test",
    propTwo: 1234,
    propThree: "okay",
    propFour: 1234
  };

  const validSecondData: ISecondInterface = {
    type: "second",
    propFive: {
      subOne: "test",
      subThree: 5,
      subTwo: "yes"
    },
    propSix: {
      propSeven: "okay",
      subFour: "sub four"
    }
  };

  describe("from alias", () => {
    describe("first interface", () => {
      it("should deserialize valid data", () => {
        assertSuccess(deserialize("TestAlias", validFirstData), result => {
          expect(result.value).toEqual(validFirstData);
        });
      });

      it("should not deserialize invalid data", () => {
        const firstDataWithMissingProp: Omit<IFirstInterface, "propOne"> = {
          type: "first",
          propTwo: 555,
          propThree: "okay",
          propFour: 1234
        };

        assertError(
          deserialize("TestAlias", firstDataWithMissingProp),
          result => {
            expect(result).toEqual({
              kind: "one-of",
              values: [
                {
                  kind: "object-key",
                  key: "propOne",
                  value: { kind: "single", value: "to exist" }
                },
                {
                  kind: "object-key",
                  key: "type",
                  value: { kind: "single", value: "second" }
                }
              ]
            });
          }
        );
      });
    });

    describe("second interface", () => {
      it("should deserialize valid data", () => {
        assertSuccess(deserialize("TestAlias", validSecondData), result => {
          expect(result.value).toEqual(validSecondData);
        });
      });

      it("should not deserialize invalid data", () => {
        const secondDataWithMissingProp: Omit<ISecondInterface, "propSix"> = {
          type: "second",
          propFive: {
            subOne: "test",
            subThree: 6,
            subTwo: "no"
          }
        };

        assertError(deserialize("TestAlias", secondDataWithMissingProp));
      });
    });
  });

  describe("from first interface", () => {
    it("should deserialize valid data", () => {
      assertSuccess(deserialize("IFirstInterface", validFirstData), result => {
        expect(result.value).toEqual(validFirstData);
      });
    });

    it("should not deserialize second interface", () => {
      assertError(deserialize("IFirstInterface", validSecondData));
    });
  });

  describe("from second interface", () => {
    it("should deserialize valid data", () => {
      assertSuccess(
        deserialize("ISecondInterface", validSecondData),
        result => {
          expect(result.value).toEqual(validSecondData);
        }
      );
    });

    it("should not deserialize second interface", () => {
      assertError(deserialize("ISecondInterface", validFirstData));
    });
  });
});
