import {
  TypeScriptValue,
  IReferenceValue,
  ValueType,
  IValueTypes
} from "../../common/types";
import ts from "typescript";
import { getLineAndCharacter } from "./get-line";

export class Cache {
  private nextId = 0;
  private readonly valueMap: Record<number, TypeScriptValue> = {};
  private readonly symbolMap: Record<number, number | undefined> = {};
  private readonly nodeMap: Record<string, number | undefined> = {};
  private readonly refMap: Record<number, TypeScriptValue> = {};

  public buildValue = <T extends ValueType>(
    type: T,
    value: Omit<IValueTypes[T], "id" | "type">
  ): IValueTypes[T] => {
    const builtValue = ({
      id: ++this.nextId,
      type,
      ...value
      // eslint-disable-next-line
    } as unknown) as IValueTypes[T];

    if (type === "reference") {
      const { refId } = builtValue as IReferenceValue;
      this.refMap[refId] = this.valueMap[refId];
    }

    return (this.valueMap[builtValue.id] = builtValue);
  };

  public getSymbolRef = (symbolId: number) => {
    return this.symbolMap[symbolId];
  };

  public setSymbolRef = (symbolId: number, refId: number) => {
    this.symbolMap[symbolId] = refId;
  };

  public setNodeRef = (node: ts.Node, refId: number) => {
    const key = this.getNodeKey(node);
    if (key) {
      this.nodeMap[key] = refId;
    }
  };

  public getNodeRef = (node: ts.Node) => {
    const key = this.getNodeKey(node);
    if (key) {
      return this.nodeMap[key];
    } else {
      return;
    }
  };

  public getRefMap = () => this.refMap;

  private getNodeKey(node: ts.Node) {
    const info = getLineAndCharacter(node);
    if (info) {
      const { file, line, character } = info;
      return file + line + character;
    } else {
      return;
    }
  }
}
