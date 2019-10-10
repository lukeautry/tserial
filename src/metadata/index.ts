import ts from "typescript";
import { metadataFromNodes } from "./get-metadata-from-nodes";
import { UnexpectedError } from "./common/unexpected-error";
import { DEFAULT_TAG } from "../common/constants";

export interface IGetMetadataParams {
  from: From;
  tagName?: string;
}

type From = IFromTsConfigPath | IFromFileList;

interface IFromTsConfigPath {
  kind: "ts-config-path";
  path: string;
}

interface IFromFileList {
  kind: "file-list";
  files: string[];
  tsConfig: ts.CompilerOptions;
}

const getProgramFromPath = ({ path }: IFromTsConfigPath) => {
  const { readDirectory, fileExists, readFile, getCurrentDirectory } = ts.sys;
  let error: ts.Diagnostic | undefined;
  const host: ts.ParseConfigFileHost = {
    onUnRecoverableConfigFileDiagnostic(diagnostic) {
      error = diagnostic;
    },
    useCaseSensitiveFileNames: false,
    readDirectory,
    fileExists,
    readFile,
    getCurrentDirectory
  };

  const parsedCmd = ts.getParsedCommandLineOfConfigFile(
    path,
    {
      noEmit: true
    },
    host
  );
  if (!parsedCmd) {
    throw new UnexpectedError(
      `Failed to parse TypeScript configuration file: ${
        error ? error.messageText : ""
      }`
    );
  }

  const { options, fileNames } = parsedCmd;

  return ts.createProgram({
    rootNames: fileNames,
    options
  });
};

const getProgramFromFileList = ({ files, tsConfig }: IFromFileList) => {
  return ts.createProgram({
    options: tsConfig,
    rootNames: files
  });
};

const getProgram = (from: From) =>
  from.kind === "ts-config-path"
    ? getProgramFromPath(from)
    : getProgramFromFileList(from);

export const getMetadata = ({
  from,
  tagName = DEFAULT_TAG
}: IGetMetadataParams) => {
  const program = getProgram(from);

  const nodes = new Array<ts.Node>();
  program.getSourceFiles().forEach(sourceFile => {
    ts.forEachChild(sourceFile, node => {
      nodes.push(node);
    });
  });

  return metadataFromNodes({
    nodes,
    tagName,
    typeChecker: program.getTypeChecker()
  });
};
