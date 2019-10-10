export const matchAll = (pattern: RegExp, str: string) => {
  const matches = new Array<RegExpExecArray>();

  let groups = pattern.exec(str);
  while (groups) {
    matches.push(groups);
    groups = pattern.exec(str);
  }

  return matches;
};
