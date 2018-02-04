const root = '../..'
const { join } = require('path')
const { moveSync, removeSync } = require('fs-extra')
const { resolveDestPath } = require(`${root}/helper/path`)

const renameFile = (src, dest) => {
    removeSync(dest)
    moveSync(src, dest)
}

const rename = (opts = {}) => async (ctx, next) => {

    const { file: { path, oldPath } } = ctx
    const { dest, base } = opts

    const srcPath = resolveDestPath(oldPath, dest, base)
    const destPath = resolveDestPath(path, dest, base)

    renameFile(srcPath, destPath)

    await next()
}

module.exports = rename
