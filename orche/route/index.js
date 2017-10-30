const root = '../..'
const { absolute } = require(`${root}/helper/path`)
const minimatch = require('minimatch')

const route = async (ctx, next, config) => {
    const { file: { path } } = ctx
    const { pattern } = config
    const resolvedPattern = absolute(pattern)
    const resolvedPath = absolute(path)
    if (minimatch(resolvedPath, resolvedPattern)) {
        await next()
    }
}

const routeInit = (pattern) => {
    const config = { pattern }
    return async (ctx, next) => await route(ctx, next, config)
}

module.exports = routeInit
