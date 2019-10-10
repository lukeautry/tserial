const reset = "\x1b[0m";

const colors = {
  red: "\x1b[31m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  white: "\x1b[37m"
};

type Color = keyof typeof colors;

export const color = (value: string, color: Color) =>
  `${colors[color]}${value}${reset}`;
