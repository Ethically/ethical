const { readFile } = require('fs-promise')
const { lookup } = require('mime-types')

const staticMiddleware = async (ctx, next) => {

    const { response, path } = ctx

    const contentType = lookup(path)
    if (!contentType) {
        return await next()
    }

    try {
        response.body = await readFile(path.slice(1))
        response.set('Content-Type', contentType)
    } catch (e) {
        await next()
    }
}

const staticMiddlewareInit = (config) => (
    async (ctx, next) => await staticMiddleware(ctx, next, config)
)

module.exports = staticMiddlewareInit
