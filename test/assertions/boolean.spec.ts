import { isBoolean } from "../../src/assertions/boolean";

describe("[assertions] boolean", () => {
  it("true", () => {
    expect(isBoolean(true)).toBe(true);
  });

  it("false", () => {
    expect(isBoolean(false)).toBe(true);
  });

  it("truthy", () => {
    expect(isBoolean(" ")).toBe(false);
  });

  it("falsey", () => {
    expect(isBoolean(undefined)).toBe(false);
  });

  it("true as string", () => {
    expect(isBoolean("true")).toBe(false);
  });

  it("false as string", () => {
    expect(isBoolean("false")).toBe(false);
  });
});
