import { isObject } from "../../src/assertions/object";

describe("[assertions] object", () => {
  it("empty object", () => {
    expect(isObject({})).toBe(true);
  });

  it("regular object", () => {
    expect(isObject({ test: "wow" })).toBe(true);
  });

  it("class", () => {
    class Test {
      public method() {
        return;
      }
    }

    expect(isObject(new Test())).toBe(true);
  });

  it("as string", () => {
    expect(isObject("{}")).toBe(false);
  });

  it("null", () => {
    expect(isObject(null)).toBe(false);
  });
});
