import { join, resolve, dirname } from 'path-browserify'
import {
    isPackage,
    isAbsolutePackage,
    appendExtension,
    getAppPrefix,
    extensions
} from '../../../helper/resolve'

const cache = {}

const createLocalRequire = parent => key => window.require(key, parent)

const resolveExports = (file) => {

    if (cache[file]) {
        return cache[file]
    }

    const definedModule = require.defined[file]

    if (definedModule) {
        const localRequire = createLocalRequire(file)
        const module = { exports: {} }

        definedModule.call(module.exports, module.exports, localRequire, module)

        return cache[file] = module
    }

    return null
}

const requestMap = (map, request, id) => {
    const mapped = map[id] && map[id][request]
    return mapped || request
}

const getModuleRoot = (path) => {
    const nodeModules = 'node_modules'
    const parts = path.split('/')
    const index = parts.lastIndexOf(nodeModules)
    if (index === -1) {
        return parts[0]
    }
    return parts.slice(0, index + 2).join('/')
}

const resolveFilename = (key, parent) => {
    if (isAbsolutePackage(key)) {
        return key
    }

    if (isPackage(key)) {
        return key
    }

    const { alias } = window.require
    const parentAlias = (alias[parent] ? alias[parent] : parent)
    const parentFile = appendExtension(parentAlias)
    const directory = dirname(parentFile)

    return join(directory, key)
}

class ModuleError extends Error {
    constructor(message, module) {
        super(message)
        this.code = 'MODULE_NOT_FOUND'
        this.module = module
    }
}

const load = (request, parent = getAppPrefix()) => {

    const require = window.require
    const mapID = getModuleRoot(parent)
    const remapped = requestMap(require.browserMap, request, mapID)
    const conflicted = requestMap(require.conflictMap, remapped, mapID)
    const key = resolveFilename(conflicted, parent)

    for (let i = 0; i < extensions.length; i++) {
        const file = appendExtension(key, extensions[i])
        const module = resolveExports(file)
        if (module) {
            return module.exports
        }
    }

    for (let i = 0; i < extensions.length; i++) {
        const file = appendExtension(join(key, 'index'), extensions[i])
        const module = resolveExports(file)
        if (module) {
            return module.exports
        }
    }

    throw new ModuleError(`Cannot find module "${key}" from "${parent}"`, key)
}

export { load }
