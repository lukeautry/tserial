import { TypeAlias } from "./numeric-literal.spec";

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
    : { kind: "single", value: expected };

const deserializers = {
  TypeAlias: (value: unknown): Result<TypeAlias> => {
    return assertNumericLiteral(value, 1234);
  }
};

type Deserializers = typeof deserializers;

export const deserialize = <K extends keyof Deserializers>(
  key: K,
  value: unknown
): ReturnType<Deserializers[K]> =>
  deserializers[key](value) as ReturnType<Deserializers[K]>;
