import { isString } from "../../src/assertions/string";

describe("[assertions] string", () => {
  it("regular string", () => {
    expect(isString("test")).toBe(true);
  });

  it("empty string", () => {
    expect(isString("")).toBe(true);
  });

  it("number", () => {
    expect(isString(1234)).toBe(false);
  });
});
