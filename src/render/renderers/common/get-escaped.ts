export const getEscaped = (value: number | string) =>
  typeof value === "string" ? `"${value}"` : value;
