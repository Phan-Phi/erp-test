const path = require("path");

// (filenames: string[]) => string | string[] | Promise<string | string[]>

const eslintCommand = (filenames) => {
  return `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;
};

const typeCheckCommand = () => {
  return `tsc -p tsconfig.json --noEmit`;
};

module.exports = {
  "*.{ts,tsx}": [eslintCommand, typeCheckCommand],
  "*.{js,jsx,ts,tsx}": ["prettier --write"],
};
