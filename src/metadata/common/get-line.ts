import ts from "typescript";

export const getSourceFile = (node: ts.Node) => {
  let current = node.parent;
  while (current) {
    if (ts.isSourceFile(current)) {
      return current;
    }
    current = current.parent;
  }

  return;
};

export const getLineAndCharacter = (node: ts.Node) => {
  const sourceFile = getSourceFile(node);
  if (sourceFile) {
    return {
      file: sourceFile.fileName,
      ...ts.getLineAndCharacterOfPosition(sourceFile, node.pos)
    };
  } else {
    return;
  }
};
