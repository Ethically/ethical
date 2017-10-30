const babel = require('./helper/transpile')
const { babel: { env: { node, test: browser } } } = require('./package.json')

browser.plugins = browser.plugins.slice(2)

const browserFiles = [
    'react/provider',
    'react/promise',
    'react/root'
]

browserFiles.forEach(file => {
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
    babel({
        src: file + '/src',
        dest: file + '/dist',
        config: node
    })
})
