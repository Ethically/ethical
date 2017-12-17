const root = '../..'
const {
    isAbsolute,
    isRelative,
    getRootPath
} = require(`${root}/helper/path`)
const {
    appendExtension,
    getAppPrefix,
    isAbsolutePackage,
    isRelativePackage,
    isAppModule,
    extensions
} = require(`${root}/helper/resolve`)
const { readFileSync } = require('fs')
const { join, resolve, dirname, extname } = require('path')
const clone = require('clone')
const { pathExistsSync } = require('fs-extra')

const cache = {}
const browserMap = {}
const conflictMap = {}
const warned = {}

const setProjectRoot = (file) => {

    let directories = dirname(file).split('/').slice(1)
    let packageJSON
    while (directories.length) {
        packageJSON = join('/', ...directories, 'package.json')
        if (pathExistsSync(packageJSON)) {
            global.ethical = global.ethical || {}
            global.ethical.cwd = dirname(packageJSON)
            return () => delete global.ethical.cwd
        }
        directories = directories.slice(0, directories.length - 1)
    }

    throw Error('Could not determine project root!')
}

const getConflictMap = () => {
    return clone(conflictMap)
}

const isConflicted = (request, parent) => {
    if (isRelative(request)) {
        return
    }
    const id = getModuleRootID(parent)
    const found = conflictMap[id] && conflictMap[id][request]
    if (found) {
        return found
    }
    resolveModulePath(request, parent)
    return conflictMap[id] && conflictMap[id][request]
}

const isPathConflicted = (path) => {
    return !!((path.match(/\/node_modules\//g) || []).length > 1)
}

const mapConflictDependecies = (request, parent, path) => {
    if (isRelative(request)) {
        return
    }
    const id = getModuleRootID(parent)
    if (!conflictMap[id]) {
        conflictMap[id] = {}
    }
    conflictMap[id][request] = generateModuleID(path)
}

const mapBrowserDependecies = (browser, parent) => {

    const id = getModuleRootID(parent)
    if (browserMap[id]) {
        return
    }

    const map = {}
    for (const request in browser) {
        const left = resolveBrowserRemap(request, parent)
        const right = resolveBrowserRemap(browser[request], parent)
        map[left] = right
    }
    if (map) {
        browserMap[id] = map
    }
}

const getBrowserMap = () => {
    return clone(browserMap)
}

const isRemapped = (request, parent) => {
    if (!parent) {
        return
    }

    const scope = getModuleRootID(parent)
    const key = resolveBrowserRemap(request, parent)
    const remapped = browserMap[scope] && browserMap[scope][key]
    if (remapped) {
        return remapped
    }
}

const getModuleRootID = (module) => {
    return generateModuleID(getNodeModuleRoot(module))
}

const resolveBrowserRemap = (request, parent) => {
    if (!request) {
        return 'ethical/noop/empty/index.js'
    }
    if (isAbsolutePackage(request)) {
        return request
    }
    return generateModuleID(resolveModulePath(request, parent))
}

const resolveAmbiguousPath = (path) => {

    if (extensions.includes(extname(path))) {
        return path
    }

    const extension = extensions.find(extension => (
        pathExistsSync(appendExtension(path, extension))
    ))

    if (extension) {
        return appendExtension(path, extension)
    }

    const index = join(path, 'index.js')
    if (pathExistsSync(index)) {
        return index
    }

    return path
}

const resolveRelative = (request, parent) => {
    return resolveAmbiguousPath(resolve(dirname(parent), request))
}

const resolveNodeModuleFile = (request, parent) => {
    const [ package, ...file ] = request.split('/')
    const packageRoot = dirname(findPackageJSON(package, parent))
    const path = resolveAmbiguousPath(join(packageRoot, ...file))

    if (isPathConflicted(path)) {
        mapConflictDependecies(request, parent, path)
    }

    return path
}

const findPackageJSON = (name, parent = '') => {
    const packageJSON = name + '/package.json'
    let directories = parent.split('/')
    let index
    const nodeModules = 'node_modules'
    while ((index = directories.lastIndexOf(nodeModules)) > -1) {
        const parentRoot = directories.slice(0, index + 2).join('/')
        const dependency = parentRoot + '/'  + nodeModules + '/' + packageJSON
        if (pathExistsSync(dependency)) {
            return dependency
        }
        directories = directories.slice(0, index - 1)
    }
    return getNodeModulesPath() + '/' + packageJSON
}

const resolveBrowserFile = (packageJSON, packageJSONPath) => {
    const { name, main, browser } = packageJSON
    if (typeof browser === 'object') {
        mapBrowserDependecies(browser, packageJSONPath)
    } else if (typeof browser === 'string') {
        return browser
    } else if (!warned[name]) {
        warned[name] = 1
        console.warn(`Might not be a browser compatible module. [${name}]`)
    }
    if (typeof main === 'string') {
        return main
    }
    return 'index.js'
}

const getPackageJSON = (packageJSONPath) => {
    if (cache[packageJSONPath]) {
        return cache[packageJSONPath]
    }
    return cache[packageJSONPath] = JSON.parse(readFileSync(packageJSONPath))
}

const resolveMainFile = (name, parent) => {
    const packageJSONPath = findPackageJSON(name, parent)
    const packageJSON = getPackageJSON(packageJSONPath)
    const packageRoot = dirname(packageJSONPath)
    return join(packageRoot, resolveBrowserFile(packageJSON, packageJSONPath))
}

const resolveNodeModule = (request, parent) => {
    const path = resolveMainFile(request, parent)

    if (isPathConflicted(path)) {
        mapConflictDependecies(request, parent, path)
    }
    return appendExtension(path)
}

const resolveModulePath = (request, parent) => {
    if (isAbsolutePackage(request)) return resolveNodeModule(request, parent)
    if (isRelativePackage(request)) return resolveNodeModuleFile(request, parent)
    if (isRelative(request)) return resolveRelative(request, parent)

    return resolveAmbiguousPath(request)
}

const getNodeModulesPath = () => (
    join(getRootPath(), 'node_modules')
)

const getNodeModuleRoot = (path) => {
    const nodeModules = 'node_modules'
    const parts = path.split('/')
    return parts.slice(0, parts.lastIndexOf(nodeModules) + 2).join('/')
}

const generateModuleID = (path) => {
    const id = path.replace(getNodeModulesPath() + '/', '')
    if (isAbsolute(id)) {
        return path.replace(getRootPath(), getAppPrefix())
    }
    return id
}

module.exports = {
  getConflictMap,
  isConflicted,
  getBrowserMap,
  isRemapped,
  getModuleRootID,
  resolveRelative,
  resolveNodeModuleFile,
  resolveNodeModule,
  resolveModulePath,
  getNodeModulesPath,
  getNodeModuleRoot,
  generateModuleID,
  setProjectRoot
}
