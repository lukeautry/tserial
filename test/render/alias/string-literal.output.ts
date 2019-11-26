import { TypeAlias } from "./string-literal.spec";

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

const deserializers = {
  TypeAlias: (value: unknown): Result<TypeAlias> => {
    return assertStringLiteral(value, "one");
  }
};

type Deserializers = typeof deserializers;

export const deserialize = <K extends keyof Deserializers>(
  key: K,
  value: unknown
): ReturnType<Deserializers[K]> =>
  deserializers[key](value) as ReturnType<Deserializers[K]>;
