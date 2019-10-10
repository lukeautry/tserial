import { isNumber } from "../../src/assertions/number";

describe("[assertions] number", () => {
  it("number", () => {
    expect(isNumber(1234)).toBe(true);
  });

  it("zero", () => {
    expect(isNumber(0)).toBe(true);
  });

  it("string", () => {
    expect(isNumber("1234")).toBe(false);
  });
});
