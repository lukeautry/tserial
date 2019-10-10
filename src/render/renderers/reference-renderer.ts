import { IRenderParams } from "./common/render-params";

export const referenceRenderer: (
  params: IRenderParams<"reference">
) => string = ({ value, varName }) =>
  `references['${value.refId}'](${varName})`;
