import { TypeAlias } from "./enum.spec";

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

const deserializers = {
  TypeAlias: (value: unknown): Result<TypeAlias> => {
    return (() => {
      const arr = [0, "two", 3];
      for (const v of arr) {
        if (v === value) {
          return success(v as TypeAlias);
        }
      }

      return {
        kind: "one-of",
        values: [
          { kind: "single", value: 0 },
          { kind: "single", value: "two" },
          { kind: "single", value: 3 }
        ]
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
