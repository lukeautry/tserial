import ts from "typescript";
import { UnexpectedError } from "./common/unexpected-error";

interface IGetMemberValueParams {
  typeChecker: ts.TypeChecker;
  member: ts.EnumMember;
}

export const getValueFromEnumMember = ({
  typeChecker,
  member
}: IGetMemberValueParams) => {
  const checkedMember = typeChecker.getTypeAtLocation(member);
  if (checkedMember.isLiteral()) {
    const { value } = checkedMember;
    if (typeof value === "string" || typeof value === "number") {
      return value;
    } else {
      throw new UnexpectedError(
        `Expected literal type to have a 'string' or 'number' value.`
      );
    }
  } else {
    throw new UnexpectedError(`Expected enum member to be a literal type.`);
  }
};
