import { assertArrayOfType } from "../../src/assertions/array-of-type";
import { assertString } from "../../src/assertions/string";
import { assertSuccess } from "../render/assert-success";
import { assertError } from "../render/assert-error";

describe("assertArrayOfType", () => {
  it("simple string array", () => {
    assertSuccess(
      assertArrayOfType(["testone", "testtwo"], value => assertString(value))
    );
  });

  it("empty array", () => {
    assertSuccess(assertArrayOfType([], value => assertString(value)));
  });

  it("has a number", () => {
    assertError(assertArrayOfType(["test", 1], value => assertString(value)));
  });
});
