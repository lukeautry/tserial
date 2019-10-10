import ts from "typescript";
import { Cache } from "./common/cache";

export interface IGetValueParams {
  cache: Cache;
  typeChecker: ts.TypeChecker;
  name: string;
}
