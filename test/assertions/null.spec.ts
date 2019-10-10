import { isNull } from "../../src/assertions/null";

describe("[assertions] null", () => {
  it("null", () => {
    expect(isNull(null)).toBe(true);
  });

  it("undefined", () => {
    expect(isNull(undefined)).toBe(false);
  });

  it("empty string", () => {
    expect(isNull("")).toBe(false);
  });

  it("as string", () => {
    expect(isNull("null")).toBe(false);
  });
});
