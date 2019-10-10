import { ValueType } from "../../common/types";
import { stringRenderer } from "./string-renderer";
import { stringLiteralRenderer } from "./string-literal-renderer";
import { numberRenderer } from "./number-renderer";
import { numericLiteralRenderer } from "./numeric-literal-renderer";
import { booleanRenderer } from "./boolean-renderer";
import { trueRenderer } from "./true-renderer";
import { falseRenderer } from "./false-renderer";
import { undefinedRenderer } from "./undefined-renderer";
import { nullRenderer } from "./null-renderer";
import { arrayRenderer } from "./array-renderer";
import { unionRenderer } from "./union-renderer";
import { tupleRenderer } from "./tuple-renderer";
import { objectRenderer } from "./object-renderer";
import { referenceRenderer } from "./reference-renderer";
import { intersectionRenderer } from "./intersection-renderer";
import { enumRenderer } from "./enum-renderer";
import { enumMemberRenderer } from "./enum-member-renderer";
import { indexRenderer } from "./index-renderer";
import { anyRenderer } from "./any-renderer";
import { IRenderParams } from "./common/render-params";
import { optionalRenderer } from "./optional-renderer";

type Renderers = {
  [K in ValueType]: (params: IRenderParams<K>) => string;
};

export const renderers: Renderers = {
  string: stringRenderer,
  "string-literal": stringLiteralRenderer,
  number: numberRenderer,
  "numeric-literal": numericLiteralRenderer,
  boolean: booleanRenderer,
  true: trueRenderer,
  false: falseRenderer,
  undefined: undefinedRenderer,
  null: nullRenderer,
  array: arrayRenderer,
  union: unionRenderer,
  tuple: tupleRenderer,
  object: objectRenderer,
  reference: referenceRenderer,
  intersection: intersectionRenderer,
  enum: enumRenderer,
  "enum-member": enumMemberRenderer,
  index: indexRenderer,
  any: anyRenderer,
  optional: optionalRenderer
};
