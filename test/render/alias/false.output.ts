import { TypeAlias } from "./false.spec";

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

const isFalse = (value: unknown): value is false => value === false;

const assertFalse = (value: unknown): Result<false> =>
  isFalse(value) ? success(value) : { kind: "single", value: false };

const deserializers = {
  TypeAlias: (value: unknown): Result<TypeAlias> => {
    return assertFalse(value);
  }
};

type Deserializers = typeof deserializers;

export const deserialize = <K extends keyof Deserializers>(
  key: K,
  value: unknown
): ReturnType<Deserializers[K]> =>
  deserializers[key](value) as ReturnType<Deserializers[K]>;
