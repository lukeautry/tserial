import { TypeAlias } from "./union.spec";

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

const error = <K extends keyof IExpectedTypes>(
  kind: K,
  value: Omit<IExpectedTypes[K], "success" | "kind">
): IExpectedTypes[K] =>
  (({
    success: false,
    kind,
    ...value
  } as unknown) as IExpectedTypes[K]);

const success = <T>(value: T): ISuccessResult<T> => ({
  success: true,
  value
});

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

const isFalse = (value: unknown): value is false => value === false;

const assertFalse = (value: unknown): Result<false> =>
  isFalse(value) ? success(value) : error("single", { value: false });

const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined";

const assertUndefined = (value: unknown): Result<undefined> =>
  isUndefined(value) ? success(value) : error("single", { value: "undefined" });

const deserializers = {
  TypeAlias: (value: unknown): Result<TypeAlias> => {
    return (() => {
      const _ts1_0 = assertStringLiteral(value, "one");
      if (_ts1_0.success) {
        return _ts1_0;
      }
      const _ts1_1 = assertStringLiteral(value, "two");
      if (_ts1_1.success) {
        return _ts1_1;
      }
      const _ts1_2 = assertFalse(value);
      if (_ts1_2.success) {
        return _ts1_2;
      }
      const _ts1_3 = assertUndefined(value);
      if (_ts1_3.success) {
        return _ts1_3;
      }

      return error("one-of", {
        values: [_ts1_0, _ts1_1, _ts1_2, _ts1_3]
      });
    })();
  }
};

type Deserializers = typeof deserializers;

export const deserialize = <K extends keyof Deserializers>(
  key: K,
  value: unknown
): ReturnType<Deserializers[K]> =>
  deserializers[key](value) as ReturnType<Deserializers[K]>;
