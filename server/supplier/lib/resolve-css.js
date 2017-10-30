const root = '../../..'
const { isRelative, getRootPath } = require(`${root}/helper/path`)
const { generateModuleID } = require(`${root}/helper/resolve-node`)
const { readFileSync } = require('fs')
const { join } = require('path')

const source = (path) => {
    const css = readFileSync(path, 'utf8').replace(/\'/g, '"')
    return `module.exports = '${css.trim()}'`
}

const resolveCSSModule = (path) => {
    const key = generateModuleID(path)
    return { key, path, source }
}

module.exports = resolveCSSModule
