import { ITestInterface } from "./object.spec";

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

const isString = (value: unknown): value is string => typeof value === "string";

const assertString = (value: unknown): Result<string> =>
  isString(value) ? success(value) : error("single", { value: "string" });

const isNumber = (value: unknown): value is number => typeof value === "number";

const assertNumber = (value: unknown): Result<number> =>
  isNumber(value) ? success(value) : error("single", { value: "number" });

const deserializers = {
  ITestInterface: (value: unknown): Result<ITestInterface> => {
    return (() => {
      if (!isObject(value)) {
        return error("single", { value: "object" });
      }

      const _ts1_0 = assertKeyValue(value, "valueOne", _ts2_v =>
        assertString(_ts2_v)
      );

      if (!_ts1_0.success) {
        return error("keyed", {
          key: "valueOne",
          value: _ts1_0
        });
      }

      const _ts1_1 = assertKeyValue(_ts1_0.value, "valueTwo", _ts3_v =>
        assertNumber(_ts3_v)
      );

      if (!_ts1_1.success) {
        return error("keyed", {
          key: "valueTwo",
          value: _ts1_1
        });
      }

      return _ts1_1;
    })();
  }
};

type Deserializers = typeof deserializers;

export const deserialize = <K extends keyof Deserializers>(
  key: K,
  value: unknown
): ReturnType<Deserializers[K]> =>
  deserializers[key](value) as ReturnType<Deserializers[K]>;
