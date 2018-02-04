import extend from 'object-extend'
import * as Module from './module.js'

const evalModules = (modules) => {
    modules.forEach(module => {
        const require = window.require
        const { id, key, alias, source } = module
        require.defineSource(key, source)
        require.ids.push(id)

        if (alias) require.alias[key] = alias
    })
}

const enableBrowserRequire = (modules) => {

    const require = (request, loaderPath) => Module.load(request, loaderPath)

    require.defined = {}
    require.ids = []
    require.processing = {}
    require.alias = {}
    require.browserMap = {}
    require.conflictMap = {}
    require.define = (module, fn) => require.defined[module] = fn
    require.defineSource = (key, source) => {
        const wrappedModule = eval(
            '(function(exports,require,module){' +
                (source + '\n') +
            '}).bind(window)'
        )
        require.define(key, wrappedModule)
    }
    require.load = (entry, options = {}) => {

        const { url = 'module' } = options

        if (require.processing[entry]) {
            return require.processing[entry]
        }

        const { ids: exclude } = require
        const headers = { 'Content-Type': 'application/json' }
        const body = JSON.stringify({ entry, exclude })
        const config = { method: 'POST', headers, body, ...options }

        const promise = (
            window.fetch(url, config)
            .then(response => {
                delete require.processing[entry]
                return response.json()
            })
            .then(({ browserMap, conflictMap, modules }) => {
                require.browserMap = extend(require.browserMap, browserMap)
                require.conflictMap = extend(require.conflictMap, conflictMap)
                evalModules(modules)
            })
            .then(() => require.warmup())
            .catch(e => console.error(e))
        )

        return require.processing[entry] = promise
    }
    require.warmupQ = []
    require.warmup = (...args) => {

        if (args.length > 0) {
            console.log('Pending warm up...', ...args)
            require.warmupQ.push(...args)
            return setTimeout(() => require.warmup(), 0)
        }

        if (require.warmupQ.length === 0) {
            return
        }

        if (Object.keys(require.processing).length > 0) {
            return
        }

        const module = require.warmupQ.pop()

        if (require.defined[module]) {
            return require.warmup()
        }

        console.log('Warming up...', module)
        require.load(module)
    }

    window.require = require

    if (modules) evalModules(modules)
}

export default enableBrowserRequire

// Inspired by:
// https://github.com/efacilitation/commonjs-require
