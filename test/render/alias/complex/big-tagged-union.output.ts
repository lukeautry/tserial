import {
  TestAlias,
  IFirstInterface,
  ISecondInterface
} from "./big-tagged-union.spec";

const isObject = (value: unknown): value is {} => {
  const type = typeof value;
  return type === "function" || (type === "object" && !!value);
};

type Result<T> = ISuccessResult<T> | Expected;

interface ISuccessResult<T> {
  success: true;
  value: T;
}

type Expected = IAllOf | IOneOf | ISingle | IKeyed;

interface IExpectedTypes {
  "all-of": IAllOf;
  "one-of": IOneOf;
  single: ISingle;
  keyed: IKeyed;
}

interface IExpected<K extends keyof IExpectedTypes> {
  success: false;
  kind: K;
}

interface IAllOf extends IExpected<"all-of"> {
  values: (JSONType | Expected)[];
}

interface IOneOf extends IExpected<"one-of"> {
  values: (JSONType | Expected)[];
}

interface ISingle extends IExpected<"single"> {
  value: JSONType | Expected;
}

interface IKeyed extends IExpected<"keyed"> {
  key: string;
  value: JSONType | Expected;
}

type JSONType = string | number | boolean | null;

const success = <T>(value: T): ISuccessResult<T> => ({
  success: true,
  value
});

const hasKey = <O extends {}, K extends string>(
  value: O,
  key: K
): value is O & Record<K, unknown> => key in value;

const error = <K extends keyof IExpectedTypes>(
  kind: K,
  value: Omit<IExpectedTypes[K], "success" | "kind">
): IExpectedTypes[K] =>
  (({
    success: false,
    kind,
    ...value
  } as unknown) as IExpectedTypes[K]);

const assertKeyValue = <O extends {}, K extends string, T>(
  value: O,
  key: K,
  assertFn: (val: unknown) => Result<T>
): Result<O & Record<K, T>> => {
  if (hasKey(value, key)) {
    const result = assertFn(value[key]);
    if (result.success) {
      // at this point, we should have merged assertions here, but that doesn't
      // seem to be happening, hence the cast
      return success((value as unknown) as O & Record<K, T>);
    } else {
      return result;
    }
  } else {
    return error("single", { value: "to exist" });
  }
};

const isStringLiteral = <K extends string>(
  value: unknown,
  expected: K
): value is K => {
  return value === expected;
};

const assertStringLiteral = <K extends string>(
  value: unknown,
  expected: K
): Result<K> =>
  isStringLiteral(value, expected)
    ? success(value)
    : error("single", { value: expected });

const isString = (value: unknown): value is string => typeof value === "string";

const assertString = (value: unknown): Result<string> =>
  isString(value) ? success(value) : error("single", { value: "string" });

const isNumber = (value: unknown): value is number => typeof value === "number";

const assertNumber = (value: unknown): Result<number> =>
  isNumber(value) ? success(value) : error("single", { value: "number" });

const isNumericLiteral = <N extends number>(
  value: unknown,
  expected: N
): value is N => {
  return value === expected;
};

const assertNumericLiteral = <N extends number>(
  value: unknown,
  expected: N
): Result<N> =>
  isNumericLiteral(value, expected)
    ? success(value)
    : error("single", { value: expected });

const references = {
  "1": (value: unknown) => {
    return (() => {
      if (!isObject(value)) {
        return error("single", { value: "object" });
      }

      const _ts1_0 = assertKeyValue(value, "type", _ts2_v =>
        assertStringLiteral(_ts2_v, "first")
      );

      if (!_ts1_0.success) {
        return error("keyed", {
          key: "type",
          value: _ts1_0
        });
      }

      const _ts1_1 = assertKeyValue(_ts1_0.value, "propOne", _ts3_v =>
        assertString(_ts3_v)
      );

      if (!_ts1_1.success) {
        return error("keyed", {
          key: "propOne",
          value: _ts1_1
        });
      }

      const _ts1_2 = assertKeyValue(_ts1_1.value, "propTwo", _ts4_v =>
        assertNumber(_ts4_v)
      );

      if (!_ts1_2.success) {
        return error("keyed", {
          key: "propTwo",
          value: _ts1_2
        });
      }

      const _ts1_3 = assertKeyValue(_ts1_2.value, "propThree", _ts5_v =>
        assertStringLiteral(_ts5_v, "okay")
      );

      if (!_ts1_3.success) {
        return error("keyed", {
          key: "propThree",
          value: _ts1_3
        });
      }

      const _ts1_4 = assertKeyValue(_ts1_3.value, "propFour", _ts6_v =>
        assertNumericLiteral(_ts6_v, 1234)
      );

      if (!_ts1_4.success) {
        return error("keyed", {
          key: "propFour",
          value: _ts1_4
        });
      }

      return _ts1_4;
    })();
  },
  "7": (value: unknown) => {
    return (() => {
      if (!isObject(value)) {
        return error("single", { value: "object" });
      }

      const _ts7_0 = assertKeyValue(value, "type", _ts8_v =>
        assertStringLiteral(_ts8_v, "second")
      );

      if (!_ts7_0.success) {
        return error("keyed", {
          key: "type",
          value: _ts7_0
        });
      }

      const _ts7_1 = assertKeyValue(_ts7_0.value, "propFive", _ts9_v =>
        (() => {
          if (!isObject(_ts9_v)) {
            return error("single", { value: "object" });
          }

          const _ts10_0 = assertKeyValue(_ts9_v, "subOne", _ts11_v =>
            assertString(_ts11_v)
          );

          if (!_ts10_0.success) {
            return error("keyed", {
              key: "subOne",
              value: _ts10_0
            });
          }

          const _ts10_1 = assertKeyValue(_ts10_0.value, "subTwo", _ts12_v =>
            (() => {
              const _ts13_0 = assertStringLiteral(_ts12_v, "yes");
              if (_ts13_0.success) {
                return _ts13_0;
              }
              const _ts13_1 = assertStringLiteral(_ts12_v, "no");
              if (_ts13_1.success) {
                return _ts13_1;
              }

              return error("one-of", {
                values: [_ts13_0, _ts13_1]
              });
            })()
          );

          if (!_ts10_1.success) {
            return error("keyed", {
              key: "subTwo",
              value: _ts10_1
            });
          }

          const _ts10_2 = assertKeyValue(_ts10_1.value, "subThree", _ts14_v =>
            (() => {
              const _ts15_0 = assertNumericLiteral(_ts14_v, 1);
              if (_ts15_0.success) {
                return _ts15_0;
              }
              const _ts15_1 = assertNumericLiteral(_ts14_v, 2);
              if (_ts15_1.success) {
                return _ts15_1;
              }
              const _ts15_2 = assertNumericLiteral(_ts14_v, 5);
              if (_ts15_2.success) {
                return _ts15_2;
              }
              const _ts15_3 = assertNumericLiteral(_ts14_v, 6);
              if (_ts15_3.success) {
                return _ts15_3;
              }

              return error("one-of", {
                values: [_ts15_0, _ts15_1, _ts15_2, _ts15_3]
              });
            })()
          );

          if (!_ts10_2.success) {
            return error("keyed", {
              key: "subThree",
              value: _ts10_2
            });
          }

          return _ts10_2;
        })()
      );

      if (!_ts7_1.success) {
        return error("keyed", {
          key: "propFive",
          value: _ts7_1
        });
      }

      const _ts7_2 = assertKeyValue(_ts7_1.value, "propSix", _ts16_v =>
        (() => {
          const _ts17_0 = (() => {
            if (!isObject(_ts16_v)) {
              return error("single", { value: "object" });
            }

            const _ts18_0 = assertKeyValue(_ts16_v, "propSeven", _ts19_v =>
              assertString(_ts19_v)
            );

            if (!_ts18_0.success) {
              return error("keyed", {
                key: "propSeven",
                value: _ts18_0
              });
            }

            return _ts18_0;
          })();
          if (!_ts17_0.success) {
            return _ts17_0;
          }
          const _ts17_1 = (() => {
            if (!isObject(_ts17_0.value)) {
              return error("single", { value: "object" });
            }

            const _ts20_0 = assertKeyValue(_ts17_0.value, "subFour", _ts21_v =>
              assertStringLiteral(_ts21_v, "sub four")
            );

            if (!_ts20_0.success) {
              return error("keyed", {
                key: "subFour",
                value: _ts20_0
              });
            }

            return _ts20_0;
          })();
          if (!_ts17_1.success) {
            return _ts17_1;
          }

          return _ts17_1;
        })()
      );

      if (!_ts7_2.success) {
        return error("keyed", {
          key: "propSix",
          value: _ts7_2
        });
      }

      return _ts7_2;
    })();
  }
};

const deserializers = {
  TestAlias: (value: unknown): Result<TestAlias> => {
    return (() => {
      const _ts22_0 = references["1"](value);
      if (_ts22_0.success) {
        return _ts22_0;
      }
      const _ts22_1 = references["7"](value);
      if (_ts22_1.success) {
        return _ts22_1;
      }

      return error("one-of", {
        values: [_ts22_0, _ts22_1]
      });
    })();
  },

  IFirstInterface: (value: unknown): Result<IFirstInterface> => {
    return references["1"](value);
  },

  ISecondInterface: (value: unknown): Result<ISecondInterface> => {
    return references["7"](value);
  }
};

type Deserializers = typeof deserializers;

export const deserialize = <K extends keyof Deserializers>(
  key: K,
  value: unknown
): ReturnType<Deserializers[K]> =>
  deserializers[key](value) as ReturnType<Deserializers[K]>;
