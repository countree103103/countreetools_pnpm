import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import rollupJson from "@rollup/plugin-json";

export default {
  input: 'dist/backend.js',
  output: {
    file: 'dist/bundle/bundle.js',
    format: 'cjs'
  },
  plugins: [nodeResolve(), commonjs(), rollupJson()]
};