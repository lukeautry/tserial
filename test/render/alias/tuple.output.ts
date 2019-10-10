import { TypeAlias } from "./tuple.spec";

const isArray = (value: unknown): value is unknown[] => Array.isArray(value);

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

const error = <K extends keyof IExpectedTypes>(
  kind: K,
  value: Omit<IExpectedTypes[K], "success" | "kind">
): IExpectedTypes[K] =>
  (({
    success: false,
    kind,
    ...value
  } as unknown) as IExpectedTypes[K]);

const isString = (value: unknown): value is string => typeof value === "string";

const assertString = (value: unknown): Result<string> =>
  isString(value) ? success(value) : error("single", { value: "string" });

const isNumber = (value: unknown): value is number => typeof value === "number";

const assertNumber = (value: unknown): Result<number> =>
  isNumber(value) ? success(value) : error("single", { value: "number" });

const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";

const assertBoolean = (value: unknown): Result<boolean> =>
  isBoolean(value) ? success(value) : error("single", { value: "boolean" });

const isNull = (value: unknown): value is null => value === null;

const assertNull = (value: unknown): Result<null> =>
  isNull(value) ? success(value) : error("single", { value: null });

const deserializers = {
  TypeAlias: (value: unknown): Result<TypeAlias> => {
    return (() => {
      if (isArray(value)) {
        const _ts1_0 = assertString(value[0]);
        if (!_ts1_0.success) {
          return error("keyed", {
            key: "[0]",
            value: _ts1_0
          });
        }

        const _ts1_1 = assertNumber(value[1]);
        if (!_ts1_1.success) {
          return error("keyed", {
            key: "[1]",
            value: _ts1_1
          });
        }

        const _ts1_2 = assertBoolean(value[2]);
        if (!_ts1_2.success) {
          return error("keyed", {
            key: "[2]",
            value: _ts1_2
          });
        }

        const _ts1_3 = assertNull(value[3]);
        if (!_ts1_3.success) {
          return error("keyed", {
            key: "[3]",
            value: _ts1_3
          });
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
        return error("single", { value: "array" });
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
