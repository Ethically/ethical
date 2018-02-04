const root = '../..'
const { removeSync } = require('fs-extra')
const { resolveDestPath } = require(`${root}/helper/path`)

const remove = (opts = {}) => async (ctx, next) => {

    const { file: { path } } = ctx
    const { dest, base } = opts

    const distFile = resolveDestPath(path, dest, base)

    removeSync(distFile)

    await next()
}

module.exports = remove
