const { transform } = require('babel-core')

const ethicalFileComposerTranspiler = async (ctx, next, opts) => {

    const { file } = ctx
    const { contents, path } = file
    const { babel } = opts

    if (typeof babel !== 'object') return await next()

    const config = {
        sourceRoot: '.',
        sourceMaps: 'inline',
        sourceFileName: path,
        sourceMapTarget: path,
        ...babel
    }
    const { map, code } = transform(contents, config)
    file.contents = new Buffer(code)
    file.map = map && new Buffer(JSON.stringify(map))
    await next()
}

const ethicalFileComposerTranspilerInit = (opts = {}) => (
    async (ctx, next) => (
        await ethicalFileComposerTranspiler(ctx, next, opts)
    )
)

module.exports = ethicalFileComposerTranspilerInit
