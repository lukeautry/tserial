export type TypeScriptValue =
  | IObjectValue
  | IStringValue
  | INumberValue
  | IStringLiteralValue
  | INumericLiteralValue
  | IUndefinedValue
  | INullValue
  | IUnionTypeValue
  | IEnumValue
  | IEnumMemberValue
  | IIntersectionTypeValue
  | IBooleanValue
  | ITrueValue
  | IFalseValue
  | IAnyValue
  | IReferenceValue
  | IArrayValue
  | ITupleValue
  | IIndexValue
  | IOptionalValue;

export type RootValue = TypeScriptValue & {
  filePath: string;
};

export type ValueType = TypeScriptValue["type"];

export interface IValueTypes {
  string: IStringValue;
  number: INumberValue;
  boolean: IBooleanValue;
  undefined: IUndefinedValue;
  object: IObjectValue;
  "string-literal": IStringLiteralValue;
  "numeric-literal": INumericLiteralValue;
  null: INullValue;
  union: IUnionTypeValue;
  enum: IEnumValue;
  "enum-member": IEnumMemberValue;
  intersection: IIntersectionTypeValue;
  true: ITrueValue;
  false: IFalseValue;
  any: IAnyValue;
  reference: IReferenceValue;
  array: IArrayValue;
  tuple: ITupleValue;
  index: IIndexValue;
  optional: IOptionalValue;
}

interface IValue {
  id: number;
  name: string;
}

export interface IObjectValue extends IValue {
  type: "object";
  properties: TypeScriptValue[];
}

export interface IStringValue extends IValue {
  type: "string";
}

export interface INumberValue extends IValue {
  type: "number";
}

export interface IUndefinedValue extends IValue {
  type: "undefined";
}

export interface IOptionalValue extends IValue {
  type: "optional";
}

export interface INullValue extends IValue {
  type: "null";
}

export interface IBooleanValue extends IValue {
  type: "boolean";
}

export interface ITrueValue extends IValue {
  type: "true";
}

export interface IFalseValue extends IValue {
  type: "false";
}

export interface IUnionTypeValue extends IValue {
  type: "union";
  values: TypeScriptValue[];
}

export interface IIntersectionTypeValue extends IValue {
  type: "intersection";
  values: TypeScriptValue[];
}

export interface IStringLiteralValue extends IValue {
  type: "string-literal";
  value: string;
}

export interface INumericLiteralValue extends IValue {
  type: "numeric-literal";
  value: number;
}

export interface IEnumValue extends IValue {
  type: "enum";
  values: (number | string)[];
}

export interface IEnumMemberValue extends IValue {
  type: "enum-member";
  value: number | string;
}

export interface IAnyValue extends IValue {
  type: "any";
}

export interface IReferenceValue extends IValue {
  type: "reference";
  refId: number;
}

export interface IArrayValue extends IValue {
  type: "array";
  value: TypeScriptValue;
}

export interface ITupleValue extends IValue {
  type: "tuple";
  values: TypeScriptValue[];
}

export interface IIndexValue extends IValue {
  type: "index";
  key: TypeScriptValue;
  value: TypeScriptValue;
}
