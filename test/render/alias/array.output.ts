import { TypeAlias } from "./array.spec";

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

const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

const error = <K extends keyof IExpectedTypes>(
  kind: K,
  value: Omit<IExpectedTypes[K], "success" | "kind">
): IExpectedTypes[K] =>
  (({
    success: false,
    kind,
    ...value
  } as unknown) as IExpectedTypes[K]);

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
    if (!result.success) {
      return error("keyed", {
        key: `[${index}]`,
        value: result
      });
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
    return error("single", { value: "array" });
  }
};

const isString = (value: unknown): value is string => typeof value === "string";

const assertString = (value: unknown): Result<string> =>
  isString(value) ? success(value) : error("single", { value: "string" });

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
