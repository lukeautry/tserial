import { isFalse } from "../../src/assertions/false";

describe("[assertions] false", () => {
  it("false", () => {
    expect(isFalse(false)).toBe(true);
  });

  it("falsey", () => {
    expect(isFalse("")).toBe(false);
  });

  it("true", () => {
    expect(isFalse(true)).toBe(false);
  });

  it("as string", () => {
    expect(isFalse("false")).toBe(false);
  });
});
