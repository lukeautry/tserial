import { isUndefined } from "../../src/assertions/undefined";

describe("[assertions] undefined", () => {
  it("undefined", () => {
    expect(isUndefined(undefined)).toBe(true);
  });

  it("null", () => {
    expect(isUndefined(null)).toBe(false);
  });

  it("empty string", () => {
    expect(isUndefined("")).toBe(false);
  });

  it("as string", () => {
    expect(isUndefined("undefined")).toBe(false);
  });
});
