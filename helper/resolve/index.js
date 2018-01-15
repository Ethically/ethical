const isNode = require('../../helper/is-node')
const { isRelative, isAbsolute, getRootPath } = require('../../helper/path')
const { join } = require('path-browserify')

const extensions = ['js', 'json', 'node']

const getAppPrefix = (moduleName) => '&'

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

const resolveAppModule = (module) => {
    if (isAppModule(module)) {
        return join(getRootPath(), module.replace(getAppPrefix(), ''))
    }
    if (isRelative(module)) return join(getRootPath(), module)
    return module
}

const requireModule = (name) => {
    const path = ( isNode() ? resolveAppModule(name) : name )
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
exports.resolveAppModule = resolveAppModule
exports.requireModule = requireModule
