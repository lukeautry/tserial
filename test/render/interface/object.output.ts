import { ITestInterface } from "./object.spec";

const isObject = (value: unknown): value is {} => {
  const type = typeof value;
  return type === "function" || (type === "object" && !!value);
};

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

const hasKey = <O extends {}, K extends string>(
  value: O,
  key: K
): value is O & Record<K, unknown> => key in value;

const assertKeyValue = <O extends {}, K extends string, T>(
  value: O,
  key: K,
  assertFn: (val: unknown) => Result<T>
): Result<O & Record<K, T>> => {
  if (hasKey(value, key)) {
    const result = assertFn(value[key]);
    if (result.kind === "success") {
      // at this point, we should have merged assertions here, but that doesn't
      // seem to be happening, hence the cast
      return success((value as unknown) as O & Record<K, T>);
    } else {
      return result;
    }
  } else {
    return {
      kind: "single",
      value: "to exist"
    };
  }
};

const isString = (value: unknown): value is string => typeof value === "string";

const assertString = (value: unknown): Result<string> =>
  isString(value) ? success(value) : { kind: "single", value: "string" };

const isNumber = (value: unknown): value is number => typeof value === "number";

const assertNumber = (value: unknown): Result<number> =>
  isNumber(value) ? success(value) : { kind: "single", value: "number" };

const deserializers = {
  ITestInterface: (value: unknown): Result<ITestInterface> => {
    return (() => {
      if (!isObject(value)) {
        return {
          kind: "single",
          value: "object"
        } as const;
      }

      const _ts1_0 = assertKeyValue(value, "valueOne", _ts2_v =>
        assertString(_ts2_v)
      );

      if (_ts1_0.kind !== "success") {
        return {
          kind: "object-key",
          key: "valueOne",
          value: _ts1_0
        } as const;
      }

      const _ts1_1 = assertKeyValue(_ts1_0.value, "valueTwo", _ts3_v =>
        assertNumber(_ts3_v)
      );

      if (_ts1_1.kind !== "success") {
        return {
          kind: "object-key",
          key: "valueTwo",
          value: _ts1_1
        } as const;
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
