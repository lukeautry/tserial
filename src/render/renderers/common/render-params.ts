import { ValueType, IValueTypes } from "../../../common/types";
import { Cache } from "../../cache";

export interface IRenderParams<K extends ValueType> {
  cache: Cache;
  name: string;
  varName: string;
  value: IValueTypes[K];
}
