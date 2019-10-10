import { getMetadata } from "../../src/metadata";

/**
 * @param currentFile Usually __filename from the calling script
 */
export const runGetMetadata = (currentFile: string) =>
  getMetadata({
    from: {
      kind: "file-list",
      files: [currentFile],
      tsConfig: {
        esModuleInterop: true,
        strict: true
      }
    }
  });
