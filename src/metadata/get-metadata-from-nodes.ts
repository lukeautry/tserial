import ts from "typescript";
import { RootValue } from "../common/types";
import { hasJSDocNodes } from "./common/jsdoc";
import { getValueFromInterface } from "./get-value-from-interface";
import { Cache } from "./common/cache";
import { getValueFromType } from "./get-value-from-type";
import { UnsupportedError } from "./common/unsupported-error";
import { getSourceFile } from "./common/get-line";
import { UnexpectedError } from "./common/unexpected-error";

interface IMetadataFromNodesParams {
  nodes: ts.Node[];
  tagName: string;
  typeChecker: ts.TypeChecker;
}

export const metadataFromNodes = ({
  nodes,
  tagName,
  typeChecker
}: IMetadataFromNodesParams) => {
  const cache = new Cache();
  const values = new Array<RootValue>();

  nodes.forEach(node => {
    // TODO: Handle namespaces and type aliases?
    const supportedDeclarationType =
      ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node);
    if (!(supportedDeclarationType && hasJSDocNodes(node))) {
      return;
    }

    if (
      !node.jsDoc.find(
        jsDoc =>
          jsDoc.tags &&
          jsDoc.tags.find(tagNode => tagNode.tagName.text === tagName)
      )
    ) {
      return;
    }

    const sourceFile = getSourceFile(node);
    if (!sourceFile) {
      throw new UnexpectedError(`Unable to find the source file for node.`);
    }
    const filePath = sourceFile.fileName;

    if (ts.isInterfaceDeclaration(node)) {
      values.push({
        ...getValueFromInterface({
          node,
          typeChecker,
          name: node.name.text,
          cache
        }),
        filePath
      });
    } else if (ts.isTypeAliasDeclaration(node)) {
      if (node.typeParameters) {
        throw new UnsupportedError("UNRESOLVED_GENERIC", node);
      }

      values.push({
        ...getValueFromType({
          typeNode: node.type,
          cache,
          name: node.name.text,
          typeChecker
        }),
        filePath
      });
    }
  });

  return {
    values,
    refMap: cache.getRefMap()
  };
};
