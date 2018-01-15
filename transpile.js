const babel = require('./helper/transpile')
const { babel: { env: { node, test: browser } } } = require('./package.json')

browser.plugins = browser.plugins.slice(2)

const browserFiles = [
    'react/helmet',
    'react/lazy',
    'react/lazy/test/files',
    'react/promise',
    'react/provider',
    'react/socket',
    'react/root'
]

browserFiles.forEach(file => {
    console.log('Transpiling:', file)
    babel({
        src: file + '/src',
        dest: file + '/dist',
        config: browser
    })
})

const nodeFiles = [
    'server/react-redux',
    'client/scripts'
]

nodeFiles.forEach(file => {
    console.log('Transpiling:', file)
    babel({
        src: file + '/src',
        dest: file + '/dist',
        config: node
    })
})
