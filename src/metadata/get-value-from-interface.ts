import ts from "typescript";
import { getValueFromType } from "./get-value-from-type";
import { UnsupportedError } from "./common/unsupported-error";
import { UnexpectedError } from "./common/unexpected-error";
import { getValueFromIndexSignature } from "./get-value-from-index-signature";
import { IGetValueParams } from "./get-value-params";

interface IGetInterfaceValueProps extends IGetValueParams {
  node: ts.InterfaceDeclaration;
  typeArguments?: ts.NodeArray<ts.TypeNode>;
}

interface IGenericResolutionData {
  parameters: ts.TypeParameterDeclaration[];
  arguments: (ts.TypeNode | undefined)[];
}

export const getValueFromInterface = ({
  node,
  typeChecker,
  name,
  cache,
  typeArguments
}: IGetInterfaceValueProps) => {
  const nodeRef = cache.getNodeRef(node);
  if (nodeRef) {
    return cache.buildValue("reference", {
      name,
      refId: nodeRef
    });
  }

  const value = cache.buildValue("object", {
    name,
    properties: []
  });
  cache.setNodeRef(node, value.id);

  if (node.heritageClauses) {
    node.heritageClauses.forEach(clause => {
      clause.types.forEach(t => {
        const typeObj = typeChecker.getTypeAtLocation(t.expression);
        if (typeObj.symbol) {
          const [declaration] = typeObj.symbol.declarations;
          if (ts.isInterfaceDeclaration(declaration)) {
            const objValue = getValueFromInterface({
              typeChecker,
              name,
              node: declaration,
              cache
            });
            if (objValue.type === "object") {
              value.properties.push(...objValue.properties);
            } else {
              const cachedRef = cache.getRefMap()[objValue.refId];
              if (!cachedRef) {
                throw new UnexpectedError(
                  "Attempted to use a referenced value in a heritage clause, but no cached reference found."
                );
              }

              if (cachedRef.type === "object") {
                value.properties.push(...cachedRef.properties);
                return;
              }

              throw new UnexpectedError(
                `Attempted to use a non-object reference property in a heritage clause: ${JSON.stringify(
                  cachedRef
                )}`
              );
            }
          }
        }
      });
    });
  }

  let genericResolution: IGenericResolutionData | undefined;
  if (node.typeParameters) {
    genericResolution = {
      parameters: [...node.typeParameters],
      arguments: typeArguments ? [...typeArguments] : []
    };
  }

  node.members.forEach(propertyNode => {
    if (ts.isMethodSignature(propertyNode)) {
      throw new UnsupportedError("FUNCTION_NOT_ALLOWED");
    }

    if (ts.isIndexSignatureDeclaration(propertyNode)) {
      value.properties.push(
        getValueFromIndexSignature({
          node: propertyNode,
          typeChecker,
          cache,
          name
        })
      );
      return;
    }

    if (
      !ts.isPropertySignature(propertyNode) ||
      !propertyNode.type ||
      !ts.isIdentifier(propertyNode.name)
    ) {
      return;
    }

    const propertyName = propertyNode.name.text;
    const propertyNodeType = propertyNode.type;

    let memberType = propertyNodeType;
    if (genericResolution) {
      const parameterIndex = genericResolution.parameters.findIndex(
        p => p.name.text === propertyNodeType.getText()
      );
      if (parameterIndex !== -1) {
        const argument =
          genericResolution.arguments[parameterIndex] ||
          genericResolution.parameters[parameterIndex].default;
        if (!argument) {
          throw new UnsupportedError("UNRESOLVED_GENERIC", propertyNode);
        }

        memberType = argument;
      }
    }

    const typeValue = getValueFromType({
      name: propertyName,
      typeNode: memberType,
      typeChecker,
      cache
    });

    if (propertyNode.questionToken) {
      if (typeValue.type === "union") {
        const { values } = typeValue;

        if (!values.some(v => v.type === "optional")) {
          values.push(
            cache.buildValue("optional", {
              name: propertyName
            })
          );
        }

        if (!values.some(v => v.type === "undefined")) {
          values.push(
            cache.buildValue("undefined", {
              name: propertyName
            })
          );
        }
      } else {
        value.properties.push(
          cache.buildValue("union", {
            name: propertyName,
            values: [
              typeValue,
              cache.buildValue("optional", { name: propertyName }),
              cache.buildValue("undefined", { name: propertyName })
            ]
          })
        );
      }
    } else {
      value.properties.push(typeValue);
    }
  });

  return value;
};
