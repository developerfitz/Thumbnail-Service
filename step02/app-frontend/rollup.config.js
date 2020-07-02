// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace'
import json from 'rollup-plugin-json';
import alias from '@rollup/plugin-alias';
import builtins from 'rollup-plugin-node-builtins';
import flow from 'rollup-plugin-flow';
import path from 'path'

const projectRootDir = path.resolve(__dirname);

export default {
  input: 'src/index.js',
  output: {
    dir: 'public',
    format: 'cjs'
  },
  plugins: [
    flow(),
    resolve({
      browser: true,
      extensions: [ '.mjs', '.js', '.jsx', '.json' , '.csv'],
    }),
    commonjs(),
    builtins(),
    json(),

    babel({
      exclude: 'node_modules/**', // only transpile our source code
      presets: ['@babel/env']
    }),
  ],
};

