import { snippets } from "./snippets";
import { TypeScriptValue } from "../common/types";

export class Cache {
  private readonly requiredSnippets: Partial<
    Record<keyof typeof snippets, boolean>
  > = {};
  private prefixId = 0;

  public constructor(
    private readonly refMap: Record<number, TypeScriptValue>
  ) {}

  public getPrefix() {
    return `_ts${++this.prefixId}_`;
  }

  public getRequiredSnippets() {
    return this.requiredSnippets;
  }

  public includeSnippet(...keys: (keyof typeof snippets)[]) {
    keys.forEach(key => {
      this.requiredSnippets[key] = true;
    });
  }

  public getRefMap(): Readonly<Record<number, TypeScriptValue>> {
    return this.refMap;
  }
}
