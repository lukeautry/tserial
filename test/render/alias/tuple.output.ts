import { TypeAlias } from "./tuple.spec";

const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

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

const isString = (value: unknown): value is string => typeof value === "string";

const assertString = (value: unknown): Result<string> =>
  isString(value) ? success(value) : { kind: "single", value: "string" };

const isNumber = (value: unknown): value is number => typeof value === "number";

const assertNumber = (value: unknown): Result<number> =>
  isNumber(value) ? success(value) : { kind: "single", value: "number" };

const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

const assertBoolean = (value: unknown): Result<boolean> =>
  isBoolean(value) ? success(value) : { kind: "single", value: "boolean" };

const isNull = (value: unknown): value is null => value === null;

const assertNull = (value: unknown): Result<null> =>
  isNull(value) ? success(value) : { kind: "single", value: null };

const deserializers = {
  TypeAlias: (value: unknown): Result<TypeAlias> => {
    return (() => {
      if (isArray(value)) {
        const _ts1_0 = assertString(value[0]);
        if (_ts1_0.kind !== "success") {
          return {
            kind: "object-key",
            key: "[0]",
            value: _ts1_0
          } as const;
        }

        const _ts1_1 = assertNumber(value[1]);
        if (_ts1_1.kind !== "success") {
          return {
            kind: "object-key",
            key: "[1]",
            value: _ts1_1
          } as const;
        }

        const _ts1_2 = assertBoolean(value[2]);
        if (_ts1_2.kind !== "success") {
          return {
            kind: "object-key",
            key: "[2]",
            value: _ts1_2
          } as const;
        }

        const _ts1_3 = assertNull(value[3]);
        if (_ts1_3.kind !== "success") {
          return {
            kind: "object-key",
            key: "[3]",
            value: _ts1_3
          } as const;
        }

        return success([
          _ts1_0.value,
          _ts1_1.value,
          _ts1_2.value,
          _ts1_3.value
        ] as [
          typeof _ts1_0["value"],
          typeof _ts1_1["value"],
          typeof _ts1_2["value"],
          typeof _ts1_3["value"]
        ]);
      } else {
        return {
          kind: "single",
          value: "array"
        } as const;
      }
    })();
  }
};

type Deserializers = typeof deserializers;

export const deserialize = <K extends keyof Deserializers>(
  key: K,
  value: unknown
): ReturnType<Deserializers[K]> =>
  deserializers[key](value) as ReturnType<Deserializers[K]>;
