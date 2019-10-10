import { IGetMetadataParams, getMetadata } from "../metadata";
import { renderImports } from "./render-imports";
import { renderDeserializers } from "./render-deserializers";
import { renderSnippets } from "./render-snippets";
import { Cache } from "./cache";
import { DEFAULT_TAG } from "../common/constants";

// eslint-disable-next-line
export interface IRenderParams extends IGetMetadataParams {
  /**
   * The file path we expect this content to be written to
   */
  expectedOutputPath: string;

  /**
   * Output imports with deno style
   */
  deno: boolean;
}

export const render = (params: IRenderParams) => {
  const { expectedOutputPath, deno } = params;
  const { values, refMap } = getMetadata(params);
  if (values.length === 0) {
    throw new Error(
      `No type expressions or interfaces have been marked with a '${params.tagName ||
        DEFAULT_TAG}' jsdoc tag.`
    );
  }

  const cache = new Cache(refMap);
  const { content, requiredSnippets } = renderDeserializers({ values, cache });

  const importBlock = renderImports({
    expectedOutputPath,
    values,
    deno
  });

  const snippets = renderSnippets(requiredSnippets);

  return `
    ${importBlock}

    ${snippets}

    ${content}
  `;
};
