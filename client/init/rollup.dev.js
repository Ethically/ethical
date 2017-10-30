import resolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import config from './config.js'

export default ({
    input: __dirname + '/src/development.js',
    output: {
        name: 'Ethical',
        file: __dirname + '/dist/development.js',
        format: 'umd'
    },
    sourcemap: 'inline',
    context: 'window',
    plugins: [
        babel(config),
        resolve({
            module: true,
            jsnext: true,
            browser: true,
            extensions: [ '.js', '.json' ],
            preferBuiltins: false
        }),
        commonjs(),
        builtins()
    ]
})
