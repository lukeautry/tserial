import { RootValue } from "../common/types";
import { relative, dirname, join, basename } from "path";
import { LINE_BREAK } from "../common/constants";

interface IRenderImportsParams {
  expectedOutputPath: string;
  values: RootValue[];
  deno: boolean;
}

export const renderImports = ({
  expectedOutputPath,
  values,
  deno
}: IRenderImportsParams) => {
  const importPaths: Record<string, string[]> = {};
  values.forEach(value => {
    const importPath = deno
      ? value.filePath
      : value.filePath.replace(".ts", "");

    let relativePath = join(
      relative(dirname(expectedOutputPath), dirname(importPath)),
      basename(importPath)
    );
    if (!relativePath.startsWith(".")) {
      relativePath = `./${relativePath}`;
    }

    const imports = (importPaths[relativePath] =
      importPaths[relativePath] || []);

    imports.push(value.name);
  });

  return `${Object.entries(importPaths)
    .map(([importPath, importValues]) => {
      return `import { ${importValues.join(", ")} } from '${importPath}';`;
    })
    .join(LINE_BREAK)}
`;
};
