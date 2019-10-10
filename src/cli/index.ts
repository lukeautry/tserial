#!/usr/bin/env node

import { parseArgs } from "./parse-args";
import { color } from "./colors";
import path from "path";
import { render } from "../render";
import fs from "fs";

const output = (text: string, exitCode: 0 | 1) => {
  console.log(text.trim());
  process.exit(exitCode);
};

(() => {
  const result = parseArgs(process.argv);
  if (!result.success) {
    return output(color(result.message, "red"), 1);
  }

  const parsedArgs = result.value;

  const showHelp = () => {
    output(
      `
Usage:
  --help: Show help
  --tsconfig: Path to tsconfig.json to use; defaults to tsconfig.json at root
  --out: Path to output file, e.g. generated.tserial.ts
  --tag: custom jsdoc tag identifier. default: 'serializable'
  --deno: Use deno-style imports
      `,
      0
    );
  };

  if (parsedArgs["help"] === true) {
    return showHelp();
  }

  const outputPath = parsedArgs["out"];
  if (typeof outputPath !== "string") {
    return output(`--out must provide a path to output the generated file`, 1);
  }

  const tagName = parsedArgs["tag"];
  if (typeof tagName === "boolean") {
    return output(`--tag should be a string value`, 1);
  }

  const workingDir = process.cwd();
  const tsConfigPath =
    parsedArgs["tsconfig"] || path.join(workingDir, "tsconfig.json");
  if (typeof tsConfigPath === "boolean") {
    return output(
      `--tsconfig should provide a path to a tsconfig.json file`,
      1
    );
  }

  let renderResult: string;
  try {
    renderResult = render({
      expectedOutputPath: path.join(workingDir, outputPath),
      from: {
        kind: "ts-config-path",
        path: tsConfigPath
      },
      tagName,
      deno: parsedArgs["deno"] === true
    });
  } catch (err) {
    return output(color(err.message, "red"), 1);
  }

  const fullyQualifiedOutpath = path.join(workingDir, outputPath);
  try {
    fs.writeFileSync(fullyQualifiedOutpath, renderResult);
  } catch (err) {
    return output(
      color(`Error occurred attempting to write file: ${err.message}`, "red"),
      1
    );
  }

  return output(`Generating complete: ${fullyQualifiedOutpath}`, 0);
})();
