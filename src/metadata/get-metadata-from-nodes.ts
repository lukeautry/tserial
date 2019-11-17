import ts from "typescript";
import { RootValue } from "../common/types";
import { hasJSDocNodes, WithJsDoc } from "./common/jsdoc";
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

type IGetNodeValueParams = {
  node: WithJsDoc<ts.Node>;
  typeChecker: ts.TypeChecker;
  filePath: string;
  cache: Cache;
};

const getNodeValue = ({
  node,
  typeChecker,
  filePath,
  cache
}: IGetNodeValueParams) => {
  if (ts.isInterfaceDeclaration(node)) {
    return {
      ...getValueFromInterface({
        node,
        typeChecker,
        name: node.name.text,
        cache
      }),
      filePath
    };
  } else if (ts.isTypeAliasDeclaration(node)) {
    if (node.typeParameters) {
      throw new UnsupportedError("UNRESOLVED_GENERIC", node);
    }

    return {
      ...getValueFromType({
        typeNode: node.type,
        cache,
        name: node.name.text,
        typeChecker
      }),
      filePath
    };
  } else {
    throw new UnsupportedError("UNSUPPORTED_NODE_TYPE");
  }
};

export const metadataFromNodes = ({
  nodes,
  tagName,
  typeChecker
}: IMetadataFromNodesParams) => {
  const cache = new Cache();
  const values = new Array<RootValue>();

  nodes.forEach(node => {
    // TODO: Handle namespaces?
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
    const rootNodeNames: Record<string, true | undefined> = {};

    const value = getNodeValue({
      cache,
      filePath,
      typeChecker,
      node
    });

    values.push(value);

    if (rootNodeNames[value.name]) {
      throw new UnsupportedError("MULTIPLE_TOP_LEVEL_NAMES");
    }

    rootNodeNames[value.name] = true;
  });

  return {
    values,
    refMap: cache.getRefMap()
  };
};
