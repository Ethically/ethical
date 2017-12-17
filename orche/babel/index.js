// const { exit }
const { transform } = require('babel-core')

const ethicalFileComposerTranspiler = async (ctx, next, config) => {

    const { file, setup } = ctx
    const { contents, path } = file
    const { babel, log } = config

    if (typeof babel !== 'object') return await next()

    const babelConfig = {
        sourceRoot: '.',
        sourceMaps: 'inline',
        sourceFileName: path,
        sourceMapTarget: path,
        filename: path,
        ...babel
    }

    try {
        const { map, code } = transform(contents, babelConfig)
        file.contents = new Buffer(code)
        file.map = map && new Buffer(JSON.stringify(map))
    } catch (e) {
        file.error = e
        log.error(e)
    }

    await next()
}

const ethicalFileComposerTranspilerInit = (config = {}) => (
    async (ctx, next) => (
        await ethicalFileComposerTranspiler(ctx, next, config)
    )
)

module.exports = ethicalFileComposerTranspilerInit
