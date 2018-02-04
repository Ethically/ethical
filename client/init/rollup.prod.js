import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import config from './config.js'

export default ({
    input: __dirname + '/src/production.js',
    output: {
        name: 'Ethical',
        format: 'umd',
        file: __dirname + '/dist/production.js'
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
        uglify()
    ]
})
