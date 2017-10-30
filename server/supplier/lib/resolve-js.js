const root = '../../..'
const {
    generateModuleID,
    resolveModulePath
} = require(`${root}/helper/resolve-node`)
const { isAbsolutePackage } = require(`${root}/helper/resolve`)
const { readFileSync } = require('fs')

const source = (path) => readFileSync(path, 'utf8')

const resolveAlias = (request, id) => {
    if (isAbsolutePackage(request)) {
        return id
    }
}

const resolveJSModule = (request, parent) => {
    const path = resolveModulePath(request, parent)
    const id = generateModuleID(path)
    const alias = resolveAlias(request, id)
    const key = ( alias ? request : id )
    return { key, alias, path, source }
}

module.exports = resolveJSModule
