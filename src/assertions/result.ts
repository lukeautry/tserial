export type Result<T> = Readonly<ISuccessResult<T> | Expected>;

export interface ISuccessResult<T> {
  kind: "success";
  value: T;
}

export type Expected = IAllOf | IOneOf | ISingle | IObjectKey;

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

export type JSONType = string | number | boolean | null;
