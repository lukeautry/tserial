import { TypeAlias } from "./union.spec";

type Result<T> = Readonly<ISuccessResult<T> | Expected>;

interface ISuccessResult<T> {
  kind: "success";
  value: T;
}

type Expected = IAllOf | IOneOf | ISingle | IObjectKey;

interface IAllOf {
  kind: "all-of";
  values: ReadonlyArray<Expected>;
}

interface IOneOf {
  kind: "one-of";
  values: ReadonlyArray<Expected>;
}

interface ISingle {
  kind: "single";
  value: JSONType;
}

interface IObjectKey {
  kind: "object-key";
  key: string;
  value: JSONType | Expected;
}

type JSONType = string | number | boolean | null;

const success = <T>(value: T): ISuccessResult<T> => ({
  kind: "success",
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
    : { kind: "single", value: expected };

const isFalse = (value: unknown): value is false => value === false;

const assertFalse = (value: unknown): Result<false> =>
  isFalse(value) ? success(value) : { kind: "single", value: false };

const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined";

const assertUndefined = (value: unknown): Result<undefined> =>
  isUndefined(value) ? success(value) : { kind: "single", value: "undefined" };

const deserializers = {
  TypeAlias: (value: unknown): Result<TypeAlias> => {
    return (() => {
      const _ts1_0 = assertStringLiteral(value, "one");
      if (_ts1_0.kind === "success") {
        return _ts1_0;
      }
      const _ts1_1 = assertStringLiteral(value, "two");
      if (_ts1_1.kind === "success") {
        return _ts1_1;
      }
      const _ts1_2 = assertFalse(value);
      if (_ts1_2.kind === "success") {
        return _ts1_2;
      }
      const _ts1_3 = assertUndefined(value);
      if (_ts1_3.kind === "success") {
        return _ts1_3;
      }

      return {
        kind: "one-of",
        values: [_ts1_0, _ts1_1, _ts1_2, _ts1_3]
      } as const;
    })();
  }
};

type Deserializers = typeof deserializers;

export const deserialize = <K extends keyof Deserializers>(
  key: K,
  value: unknown
): ReturnType<Deserializers[K]> =>
  deserializers[key](value) as ReturnType<Deserializers[K]>;
