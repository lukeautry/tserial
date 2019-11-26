import { TypeAlias } from "./array.spec";

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

const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

type ArrayScanResult<T> = IArrayScanSuccess<T> | Expected;

interface IArrayScanSuccess<T> {
  kind: "success";
  values: T[];
}

const scanArrayForType = <T>(
  values: unknown[],
  fn: (ele: unknown) => Result<T>
): ArrayScanResult<T> => {
  for (let index = 0; index < values.length; index++) {
    const result = fn(values[index]);
    if (result.kind !== "success") {
      return {
        kind: "object-key",
        key: `[${index}]`,
        value: result
      };
    }
  }

  return { kind: "success", values: values as T[] };
};

const assertArrayOfType = <T>(
  value: unknown,
  fn: (ele: unknown) => Result<T>
): Result<T[]> => {
  if (isArray(value)) {
    const scanResult = scanArrayForType(value, fn);
    if (scanResult.kind === "success") {
      return success(scanResult.values);
    } else {
      return scanResult;
    }
  } else {
    return {
      kind: "single",
      value: "array"
    };
  }
};

const isString = (value: unknown): value is string => typeof value === "string";

const assertString = (value: unknown): Result<string> =>
  isString(value) ? success(value) : { kind: "single", value: "string" };

const deserializers = {
  TypeAlias: (value: unknown): Result<TypeAlias> => {
    return assertArrayOfType(value, _ts1_e => {
      return assertString(_ts1_e);
    });
  }
};

type Deserializers = typeof deserializers;

export const deserialize = <K extends keyof Deserializers>(
  key: K,
  value: unknown
): ReturnType<Deserializers[K]> =>
  deserializers[key](value) as ReturnType<Deserializers[K]>;
