import { Node, JSDoc } from "typescript";

export type WithJsDoc<T> = T & { jsDoc: JSDoc[] };

export const hasJSDocNodes = <T extends Node>(
  node: T
): node is WithJsDoc<T> => {
  const { jsDoc } = node as WithJsDoc<T>;
  return !!jsDoc && jsDoc.length > 0;
};
