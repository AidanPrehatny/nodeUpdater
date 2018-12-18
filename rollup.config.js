import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';
var chokidar = require('chokidar');

const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`${NODE_ENV === 'production'} for rollup terser `);

export default {
    input: './index.jsx',
    output: [{
        file: './nodeUpdater.js',
        format: 'cjs'
    }],
    external: [
        'react',
        'ol'
    ],
    watch: {
        chokidar: {
            persistent: true
        },
        exclude: ['node_modules/**']
    },
    plugins: [
        resolve(),
        babel({
            babelrc: false,
            exclude: 'node_modules/**',
            presets: [
                ['@babel/preset-env',{modules: false}],
                '@babel/preset-flow'
            ],
            plugins: [
                '@babel/plugin-transform-react-jsx',
                ['@babel/plugin-proposal-class-properties', {loose: true}],
                ['@babel/plugin-proposal-decorators', {legacy: true}]
            ]
        }),
        commonjs({
            include: 'node_modules/**'
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
        }),
        NODE_ENV === 'production' && terser()
    ]
};
