import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import rollupJson from "@rollup/plugin-json";

/**
 * @type {import("rollup").RollupOptions}
 */
const config =  {
  input: 'dist/backend.js',
  output: {
    file: 'dist/bundle/bundle.js',
    format: 'cjs'
  },
  plugins: [nodeResolve(), commonjs(), rollupJson()]
};

export default config;