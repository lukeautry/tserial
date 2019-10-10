export type ParseResult = IParseSuccess | IParseError;

interface IParseSuccess {
  success: true;
  value: ParsedArgs;
}

export type ParsedArgs = Record<string, boolean | string | undefined>;

interface IParseError {
  success: false;
  message: string;
}

const success = (value: ParsedArgs) => ({ success: true, value } as const);
const error = (message: string) => ({ success: false, message } as const);
const unknownCommand = (cmd: string) => error(`Unknown command: ${cmd}`);

const parsePart = (element: string) => {
  if (element.startsWith("--")) {
    return {
      type: "key",
      value: element.slice(2, element.length)
    } as const;
  } else {
    return {
      type: "value",
      value: element
    } as const;
  }
};

export const parseArgs = (fullArgs: string[]): ParseResult => {
  const args = fullArgs.slice(2);
  if (args.length === 0) {
    return success({});
  }

  const result: ParsedArgs = {};

  let index = 0;
  while (args[index]) {
    const current = args[index];
    const parsed = parsePart(current);
    if (parsed.type === "value" || !parsed.value) {
      return unknownCommand(current);
    }

    const nextCommand = args[index + 1];
    if (!nextCommand) {
      result[parsed.value] = true;
      break;
    }

    const parsedNext = parsePart(nextCommand);
    if (parsedNext.type === "value") {
      result[parsed.value] = parsedNext.value;
      index += 2;
    } else {
      result[parsed.value] = true;
      index += 1;
    }
  }

  return success(result);
};
