const isNode = require('../../helper/is-node')
const { isRelative, isAbsolute, getRootPath } = require('../../helper/path')
const { join, resolve, dirname } = require('path')

const extensions = ['js', 'json', 'node']

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

const getAppPrefix = (moduleName) => '~'

const isAppModule = (moduleName) => (
    moduleName.charAt(0) === getAppPrefix()
)

const isPackage = (name) => {
    if (isRelative(name) || isAbsolute(name)) return false
    return true
}

const isAbsolutePackage = (name) => {
    if (isPackage(name) && name.indexOf('/') === -1)
        return true
    return false
}

const isRelativePackage = (name) => {
    if (name.indexOf('/') > -1 && isPackage(name)) return true
    return false
}

const appendExtension = (name, extension = 'js') => {
    if (isAbsolutePackage(name)) return name
    const ext = '.' + extension
    if (name.slice(-(ext.length)) === ext) return name
    return name + ext
}

const getRequire = () => {
    if (isNode()) return require
    return window.require
}

const resolveModuleName = (module) => {
    if (isAppModule(module)) {
        return join(getRootPath(), replace(getAppPrefix(), ''))
    }
    if (isRelative(module)) return join(getRootPath(), module)
    return module
}

const requireModule = (name) => {
    const path = ( isNode() ? resolveModuleName(name) : name )
    return getRequire()(path)
}

exports.extensions = extensions
exports.getAppPrefix = getAppPrefix
exports.isAppModule = isAppModule
exports.isPackage = isPackage
exports.isAbsolutePackage = isAbsolutePackage
exports.isRelativePackage = isRelativePackage
exports.appendExtension = appendExtension
exports.getRequire = getRequire
exports.resolveModuleName = resolveModuleName
exports.requireModule = requireModule
exports.resolveAmbiguousPath = resolveAmbiguousPath
