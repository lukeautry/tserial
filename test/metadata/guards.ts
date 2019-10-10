import {
  TypeScriptValue,
  IStringValue,
  IUnionTypeValue,
  IStringLiteralValue,
  INumberValue,
  INullValue,
  INumericLiteralValue,
  IEnumValue,
  IEnumMemberValue,
  IObjectValue,
  IIntersectionTypeValue,
  IBooleanValue,
  IFalseValue,
  ITrueValue,
  IReferenceValue,
  IUndefinedValue,
  IArrayValue,
  ITupleValue,
  IIndexValue,
  IOptionalValue
} from "../../src/common/types";

const assert = <V extends TypeScriptValue>(
  type: V["type"],
  value: TypeScriptValue | undefined,
  fn?: (value: V) => void
) => {
  if (!value) {
    throw new Error(`expected value to be defined`);
  } else if (value.type !== type) {
    throw new Error(`expected a value of type '${type}'; got ${value.type}`);
  } else if (fn) {
    return fn(value as V);
  }
};

export const assertObject = (
  value: TypeScriptValue | undefined,
  fn?: (v: IObjectValue) => void
) => assert("object", value, fn);

export const assertString = (
  value: TypeScriptValue | undefined,
  fn?: (v: IStringValue) => void
) => assert("string", value, fn);

export const assertBoolean = (
  value: TypeScriptValue | undefined,
  fn?: (v: IBooleanValue) => void
) => assert("boolean", value, fn);

export const assertTrue = (
  value: TypeScriptValue | undefined,
  fn?: (v: ITrueValue) => void
) => assert("true", value, fn);

export const assertFalse = (
  value: TypeScriptValue | undefined,
  fn?: (v: IFalseValue) => void
) => assert("false", value, fn);

export const assertNull = (
  value: TypeScriptValue | undefined,
  fn?: (v: INullValue) => void
) => assert("null", value, fn);

export const assertUndefined = (
  value: TypeScriptValue | undefined,
  fn?: (v: IUndefinedValue) => void
) => assert("undefined", value, fn);

export const assertOptional = (
  value: TypeScriptValue | undefined,
  fn?: (v: IOptionalValue) => void
) => assert("optional", value, fn);

export const assertNumber = (
  value: TypeScriptValue | undefined,
  fn?: (v: INumberValue) => void
) => assert("number", value, fn);

export const assertStringLiteral = (
  value: TypeScriptValue | undefined,
  fn?: (v: IStringLiteralValue) => void
) => assert("string-literal", value, fn);

export const assertNumberLiteral = (
  value: TypeScriptValue | undefined,
  fn?: (v: INumericLiteralValue) => void
) => assert("numeric-literal", value, fn);

export const assertUnion = (
  value: TypeScriptValue | undefined,
  fn?: (v: IUnionTypeValue) => void
) => assert("union", value, fn);

export const assertIntersection = (
  value: TypeScriptValue | undefined,
  fn?: (v: IIntersectionTypeValue) => void
) => assert("intersection", value, fn);

export const assertEnum = (
  value: TypeScriptValue | undefined,
  fn?: (v: IEnumValue) => void
) => assert("enum", value, fn);

export const assertEnumMember = (
  value: TypeScriptValue | undefined,
  fn?: (v: IEnumMemberValue) => void
) => assert("enum-member", value, fn);

export const assertRef = (
  value: TypeScriptValue | undefined,
  fn?: (v: IReferenceValue) => void
) => assert("reference", value, fn);

export const assertArray = (
  value: TypeScriptValue | undefined,
  fn?: (v: IArrayValue) => void
) => assert("array", value, fn);

export const assertTuple = (
  value: TypeScriptValue | undefined,
  fn?: (v: ITupleValue) => void
) => assert("tuple", value, fn);

export const assertIndex = (
  value: TypeScriptValue | undefined,
  fn?: (v: IIndexValue) => void
) => assert("index", value, fn);

export const assertUnionOf = (
  value: TypeScriptValue | undefined,
  types: TypeScriptValue["type"][]
) =>
  assert("union", value, (unionTypeValue: IUnionTypeValue) => {
    if (types.length !== unionTypeValue.values.length) {
      throw new Error(
        `Expected union of ${unionTypeValue.values.length} elements, `
      );
    }

    types.forEach(type => {
      const typeValue = unionTypeValue.values.find(v => v.type === type);
      if (!typeValue) {
        throw new Error(`expected union type values to contain a type ${type}`);
      }
    });
  });
