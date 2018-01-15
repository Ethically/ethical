const root = '../../..'
const requireHacker = require('require-hacker')
const { extname, dirname, join } = require('path')
const { pathExistsSync, readFileSync } = require('fs-extra')
const {
  browserify,
  unbrowserify
} = require(`${root}/helper/browserify`)
const {
    getAppPrefix,
    requireModule,
    isRelativePackage,
    isAbsolutePackage
} = require(`${root}/helper/resolve`)
const {
    isRemapped,
    isConflicted,
    getBrowserMap,
    getConflictMap,
    getModuleRootID,
    generateModuleID,
    resolveModulePath,
    setProjectRoot
} = require(`${root}/helper/resolve-node`)
const { absolute, relative } = require(`${root}/helper/path`)

let moduleID = 0
const cache = {}

const resolveSourceMap = (source, path) => {
    const comment = '//# sourceMappingURL='
    if (source.includes(comment)) {
        return source
    }
    const file = path.replace(process.cwd(), '')
    const sourceMap = {
        version : 3,
        file,
        sources: [ file ]
    }
    const base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64')
    return source + '\n' + comment + 'data:application/json;base64,' + base64
}

const resolveMap = (map, modules) => {
    const resolvedMap = {}
    modules.forEach(({ key }) => {
        const rootKey = getModuleRootID(key)
        const mapped = map[rootKey]
        if (mapped) {
            resolvedMap[rootKey] = mapped
        }
    })
    return resolvedMap
}

const source = (path) => readFileSync(path, 'utf8')

const resolveAlias = (request, id) => {
    if (isAbsolutePackage(request)) {
        return id
    }
}

const resolveModule = (request, parent) => {
    const path = resolveModulePath(request, parent)
    const id = generateModuleID(path)
    const alias = resolveAlias(request, id)
    const key = ( alias ? request : id )
    return { key, alias, path, source }
}

const resolveCache = (cached, modules, exclude) => {
    const { id, key, alias, source, path } = cached

    if (typeof require.cache[path + '.*'] === 'object') {
        global
        .__ethical_server_middleware_module_supplier__
        [path] = require.cache[path + '.*'].exports
    }

    if (exclude[id]) {
        const stubbedSource = `
            module.exports = (
                global.__ethical_server_middleware_module_supplier__['${path}']
            )
        `
        return { source: stubbedSource, path }
    }

    modules.push(cached)
    exclude[id] = 1
    return { source, path }
}

const handler = (modules, exclude) => (request, { filename: parent }) => {

    const remapped = isRemapped(request, parent) || request
    const conflicted = isConflicted(remapped, parent) || remapped
    if (cache[conflicted]) {
        return resolveCache(cache[conflicted], modules, exclude)
    }

    const resolvedModule = resolveModule(conflicted, parent)
    const { key, alias, path, source: getSource } = resolvedModule

    if (cache[key]) {
        return resolveCache(cache[key], modules, exclude)
    }

    const source = resolveSourceMap(getSource(path), path)
    const id =  moduleID++

    cache[key] = { id, key, alias, source, path }

    return resolveCache(cache[key], modules, exclude)
}

const captureModules = (exclude) => {
    const modules = []
    const globalHook = requireHacker.global_hook('*', handler(modules, exclude))
    return () => {
        const cachedModules = modules.map(cached => {
            const { id, key, alias, source, path } = cached

            if (typeof require.cache[path + '.*'] === 'object') {
                global
                .__ethical_server_middleware_module_supplier__
                [path] = require.cache[path + '.*'].exports
            }

            return { id, key, alias, source }
        })
        globalHook.unmount()
        return cachedModules
    }
}

const moduleSupplierMiddleware = async (ctx, next, config) => {

    if (typeof ctx.response.body !== 'undefined') {
        return await next()
    }

    const { main, path = 'module' } = config

    if (ctx.request.path !== '/' + path) {
        return await next()
    }

    const resetProjectRoot = setProjectRoot(module.parent.parent.id)

    const { request: { headers, body = {} } } = ctx
    const { entry = absolute(main), exclude = [] } = body

    browserify(ctx.request)
    const excluded = {}
    exclude.forEach(id => excluded[id] = 1)
    const releaseModules = captureModules(excluded)

    try {
        requireModule(resolveModulePath(entry))
    } catch (e) {
        console.error(e)
    }
    const modules = releaseModules()

    unbrowserify()

    const [ mainModule = {} ] = modules

    if (main === relative(entry)) {
        mainModule.alias = mainModule.key
        mainModule.key = getAppPrefix()
    }

    const browserMap = resolveMap(getBrowserMap(), modules)
    const conflictMap = resolveMap(getConflictMap(), modules)

    resetProjectRoot()

    ctx.response.body = JSON.stringify({ browserMap, conflictMap, modules })
    ctx.response.set('Content-Type', 'application/json')

    await next()
}

const moduleSupplierMiddlewareInit = (config = {}) => {
    global.__ethical_server_middleware_module_supplier__ = {}
    return async (ctx, next) => (
        await moduleSupplierMiddleware(ctx, next, config)
    )
}

module.exports = moduleSupplierMiddlewareInit
