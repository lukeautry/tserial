import { snippets } from "./snippets";

type SnippetKey = keyof typeof snippets;
type RequiredSnippets = Partial<Record<SnippetKey, boolean>>;

const resolve = (requiredSnippets: RequiredSnippets) => {
  const orderedDependencies = new Array<SnippetKey>();
  const visited: Record<string, true> = {};
  const keys = Object.keys(requiredSnippets) as SnippetKey[];

  keys.forEach(function visit(name: SnippetKey, i: number | string[]) {
    const ancestors = Array.isArray(i) ? [...i, name] : [name];
    visited[name] = true;

    (snippets[name].dependencies as SnippetKey[]).forEach(dep => {
      if (ancestors.indexOf(dep) >= 0) {
        throw new Error(
          `Circular dependency '${dep}' is required by '${name}': ${ancestors.join(
            " -> "
          )}`
        );
      }

      if (!visited[dep]) {
        visit(dep, ancestors.slice(0));
      }
    });

    if (orderedDependencies.indexOf(name) < 0) {
      orderedDependencies.push(name);
    }
  });

  return orderedDependencies;
};

export const renderSnippets = (requiredSnippets: RequiredSnippets) => {
  const output = resolve(requiredSnippets);

  return `
    ${output.map(key => snippets[key].content).join("\r\n\r\n")}
  `;
};
