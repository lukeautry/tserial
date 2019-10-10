import { parseArgs, ParseResult, ParsedArgs } from "../../src/cli/parse-args";

describe("parseArgs", () => {
  const assertSuccess = (
    result: ParseResult,
    fn?: (value: ParsedArgs) => void
  ) => {
    if (!result.success) {
      throw new Error(`Expected parse success. Got: ${result.message}`);
    }

    if (fn) {
      fn(result.value);
    }
  };

  const assertError = (result: ParseResult) => {
    expect(!result.success);
  };

  it("should return empty object for no args", () => {
    assertSuccess(parseArgs(["ts-node", "index.js"]), value => {
      expect(value).toEqual({});
    });
  });

  it("should return error for no command and only value", () => {
    assertError(parseArgs(["ts-node", "index.js", "floating_arg"]));
  });

  it("should return error for no command with no text", () => {
    assertError(parseArgs(["ts-node", "index.js", "--"]));
  });

  it("should return error for invalid arg after valid", () => {
    assertError(
      parseArgs(["ts-node", "index.js", "--argOne", "someValue", "someOther"])
    );
  });

  it("should return boolean for no extra arg", () => {
    assertSuccess(parseArgs(["ts-node", "index.js", "--argOne"]), value => {
      expect(value).toEqual({
        argOne: true
      });
    });
  });

  it("should return string for arg", () => {
    assertSuccess(
      parseArgs(["ts-node", "index.js", "--argOne", "someValue"]),
      value => {
        expect(value).toEqual({
          argOne: "someValue"
        });
      }
    );
  });

  it("complex example", () => {
    assertSuccess(
      parseArgs([
        "ts-node",
        "index.js",
        "--argOne",
        "someValue",
        "--argTwo",
        "--argThree",
        "valueTwo"
      ]),
      value => {
        expect(value).toEqual({
          argOne: "someValue",
          argTwo: true,
          argThree: "valueTwo"
        });
      }
    );
  });
});
