import { hasKey } from "../../src/assertions/has-key";

describe("[assertions] has key", () => {
  it("with key", () => {
    expect(hasKey({ test: "wow" }, "test")).toBe(true);
  });

  it("without key", () => {
    expect(hasKey({ test: "wow" }, "nottest")).toBe(false);
  });
});
