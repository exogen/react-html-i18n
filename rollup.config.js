import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import buble from "@rollup/plugin-buble";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const baseConfig = {
  input: "src/index.js",
  external: ["parse5", "quick-lru", "react-dom", "react", "style-to-object"],
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "es" },
  ],
  plugins: [buble({ objectAssign: "Object.assign" }), resolve(), commonjs()],
};

const browserConfig = {
  ...baseConfig,
  output: [
    { file: pkg.browser[pkg.main], format: "cjs" },
    { file: pkg.browser[pkg.module], format: "es" },
  ],
  plugins: [
    replace({
      "process.browser": JSON.stringify(true),
    }),
    ...baseConfig.plugins,
  ],
};

export default [
  {
    ...baseConfig,
    input: "src/index.js",
    output: [
      { file: "./dist/index.cjs.js", format: "cjs" },
      { file: "./dist/index.esm.js", format: "es" },
    ],
    plugins: [
      replace({
        "process.browser": JSON.stringify(false),
      }),
      ...baseConfig.plugins,
    ],
  },
  {
    ...browserConfig,
    input: "src/index.js",
    output: [
      { file: "./dist/index.browser.cjs.js", format: "cjs" },
      { file: "./dist/index.browser.esm.js", format: "es" },
    ],
  },
  {
    ...browserConfig,
    input: "src/index.js",
    output: [
      {
        file: "./dist/index.browser.cjs.min.js",
        format: "cjs",
      },
      {
        file: "./dist/index.browser.esm.min.js",
        format: "es",
      },
    ],
    plugins: [...browserConfig.plugins, terser({ toplevel: true })],
  },
];
