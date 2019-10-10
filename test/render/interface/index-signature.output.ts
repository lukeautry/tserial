import { ITestInterface } from "./index-signature.spec";

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

const assertRecord = <O extends {}, T>(
  value: O,
  assertFn: (val: unknown) => Result<T>
): Result<O & Record<string, T>> => {
  const objKeys = Object.keys(value);
  for (const key of objKeys) {
    if (hasKey(value, key)) {
      const objVal = value[key];
      const result = assertFn(objVal);
      if (!result.success) {
        return result;
      }
    } else {
      return error("keyed", { key, value });
    }
  }

  return success(value as O & Record<string, T>);
};

const references = {
  "3": (value: unknown) => {
    return (() => {
      if (!isObject(value)) {
        return error("single", { value: "object" });
      }

      const _ts1_0 = assertKeyValue(value, "value", _ts2_v =>
        assertString(_ts2_v)
      );

      if (!_ts1_0.success) {
        return error("keyed", {
          key: "value",
          value: _ts1_0
        });
      }

      return _ts1_0;
    })();
  }
};

const deserializers = {
  ITestInterface: (value: unknown): Result<ITestInterface> => {
    return (() => {
      if (!isObject(value)) {
        return error("single", { value: "object" });
      }

      const _ts3_0 = assertRecord(value, _ts4_v => references["3"](_ts4_v));
      if (!_ts3_0.success) {
        return _ts3_0;
      }

      const _ts3_1 = assertKeyValue(_ts3_0.value, "test", _ts5_v =>
        references["3"](_ts5_v)
      );

      if (!_ts3_1.success) {
        return error("keyed", {
          key: "test",
          value: _ts3_1
        });
      }

      return _ts3_1;
    })();
  }
};

type Deserializers = typeof deserializers;

export const deserialize = <K extends keyof Deserializers>(
  key: K,
  value: unknown
): ReturnType<Deserializers[K]> =>
  deserializers[key](value) as ReturnType<Deserializers[K]>;
