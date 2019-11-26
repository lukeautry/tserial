import { TypeAlias } from "./tagged-union.spec";

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

const isString = (value: unknown): value is string => typeof value === "string";

const assertString = (value: unknown): Result<string> =>
  isString(value) ? success(value) : { kind: "single", value: "string" };

const isNumber = (value: unknown): value is number => typeof value === "number";

const assertNumber = (value: unknown): Result<number> =>
  isNumber(value) ? success(value) : { kind: "single", value: "number" };

const isTrue = (value: unknown): value is true => value === true;

const assertTrue = (value: unknown): Result<true> =>
  isTrue(value) ? success(value) : { kind: "single", value: true };

const deserializers = {
  TypeAlias: (value: unknown): Result<TypeAlias> => {
    return (() => {
      const _ts1_0 = (() => {
        if (!isObject(value)) {
          return {
            kind: "single",
            value: "object"
          } as const;
        }

        const _ts2_0 = assertKeyValue(value, "kind", _ts3_v =>
          assertStringLiteral(_ts3_v, "one")
        );

        if (_ts2_0.kind !== "success") {
          return {
            kind: "object-key",
            key: "kind",
            value: _ts2_0
          } as const;
        }

        const _ts2_1 = assertKeyValue(_ts2_0.value, "value", _ts4_v =>
          assertString(_ts4_v)
        );

        if (_ts2_1.kind !== "success") {
          return {
            kind: "object-key",
            key: "value",
            value: _ts2_1
          } as const;
        }

        return _ts2_1;
      })();
      if (_ts1_0.kind === "success") {
        return _ts1_0;
      }
      const _ts1_1 = (() => {
        if (!isObject(value)) {
          return {
            kind: "single",
            value: "object"
          } as const;
        }

        const _ts5_0 = assertKeyValue(value, "kind", _ts6_v =>
          assertStringLiteral(_ts6_v, "two")
        );

        if (_ts5_0.kind !== "success") {
          return {
            kind: "object-key",
            key: "kind",
            value: _ts5_0
          } as const;
        }

        const _ts5_1 = assertKeyValue(_ts5_0.value, "value", _ts7_v =>
          assertNumber(_ts7_v)
        );

        if (_ts5_1.kind !== "success") {
          return {
            kind: "object-key",
            key: "value",
            value: _ts5_1
          } as const;
        }

        return _ts5_1;
      })();
      if (_ts1_1.kind === "success") {
        return _ts1_1;
      }
      const _ts1_2 = (() => {
        if (!isObject(value)) {
          return {
            kind: "single",
            value: "object"
          } as const;
        }

        const _ts8_0 = assertKeyValue(value, "kind", _ts9_v =>
          assertStringLiteral(_ts9_v, "three")
        );

        if (_ts8_0.kind !== "success") {
          return {
            kind: "object-key",
            key: "kind",
            value: _ts8_0
          } as const;
        }

        const _ts8_1 = assertKeyValue(_ts8_0.value, "value", _ts10_v =>
          assertTrue(_ts10_v)
        );

        if (_ts8_1.kind !== "success") {
          return {
            kind: "object-key",
            key: "value",
            value: _ts8_1
          } as const;
        }

        return _ts8_1;
      })();
      if (_ts1_2.kind === "success") {
        return _ts1_2;
      }

      return {
        kind: "one-of",
        values: [_ts1_0, _ts1_1, _ts1_2]
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
