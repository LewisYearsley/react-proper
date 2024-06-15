const typescript = require("@rollup/plugin-typescript")

module.exports = {
  input: "index.tsx",
  output: {
    file: "dist/cjs/index.js",
    format: "cjs",
  },
  plugins: [typescript()],
}
