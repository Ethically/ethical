const root = '../..'
const { join } = require('path')
const {
    writeFileSync, ensureFileSync, moveSync, removeSync
} = require('fs-extra')
const { resolveDestPath } = require(`${root}/helper/path`)
const { generateModuleID } = require(`${root}/helper/resolve-node`)

const writeFile = (path, content) => {
    ensureFileSync(path)
    writeFileSync(path, content)
}

const renameFile = (dest, suffix) => {
    removeSync(dest + suffix)
    moveSync(dest, dest + suffix)
}

const lazy = (opts = {}) => async (ctx, next) => {

    const { file: { path } } = ctx
    const {
        suffix = '.lazy.js', component = 'ethical/react/lazy', dest, base
    } = opts

    const destPath = resolveDestPath(path, dest, base)
    renameFile(destPath, suffix)


    const id = generateModuleID(destPath)
    const content = (
        `var lazy = require('${component}').default\n` +
        `module.exports = lazy('${id + suffix}')`
    )
    
    writeFile(destPath, content)

    await next()
}

module.exports = lazy
