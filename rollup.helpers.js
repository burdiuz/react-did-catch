import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export const LIBRARY_VAR_NAME = 'CodeEditor';

export const plugins = [
  resolve(),
  babel({
    presets: ['@babel/react'],
	plugins: ['@babel/plugin-proposal-class-properties'],
    exclude: 'node_modules/**',
    babelrc: false,
  }),
  commonjs(),
  json(),
];

export const cjsConfig = {
  input: 'source/index.js',
  output: [
    {
      file: 'index.js',
      sourcemap: true,
      exports: 'named',
      format: 'cjs',
    },
  ],
  plugins,
  external: [
    'react',
    'prop-types',
    '@actualwave/is-function',
  ],
};
