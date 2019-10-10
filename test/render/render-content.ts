import { render } from "../../src";
import { promises as fs } from "fs";
import prettier from "prettier";
import { getFiles } from "../../dev/common/get-files";

/**
 * @param file Usually __filename from the calling script
 */
const runRender = async (file: string) => {
  const expectedOutputPath = file.replace("spec.ts", "output.ts");
  const content = render({
    from: {
      kind: "file-list",
      files: [file],
      tsConfig: {
        esModuleInterop: true,
        strict: true
      }
    },
    expectedOutputPath,
    deno: false
  });

  const formatted = (() => {
    try {
      return prettier.format(content, {
        parser: "typescript"
      });
    } catch (err) {
      console.log(`Error in ${expectedOutputPath}: ${err.message}`);
      return content;
    }
  })();

  await fs.writeFile(expectedOutputPath, formatted);
};

(async () => {
  const files = await getFiles("./test/render");
  const outputFiles = new Array<string>();
  const specFiles = new Array<string>();

  files.forEach(file => {
    if (file.endsWith(".output.ts")) {
      outputFiles.push(file);
    } else if (file.endsWith(".spec.ts")) {
      specFiles.push(file);
    }
  });

  await Promise.all(outputFiles.map(file => fs.unlink(file)));
  await Promise.all(specFiles.map(file => runRender(file)));
})();
