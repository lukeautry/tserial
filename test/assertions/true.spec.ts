import { isTrue } from "../../src/assertions/true";

describe("[assertions] true", () => {
  it("true", () => {
    expect(isTrue(true)).toBe(true);
  });

  it("truthy", () => {
    expect(isTrue("test")).toBe(false);
  });

  it("false", () => {
    expect(isTrue(false)).toBe(false);
  });

  it("as string", () => {
    expect(isTrue("true")).toBe(false);
  });
});
