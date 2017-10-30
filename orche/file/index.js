const root = '../..'
const { resolveDestPath } = require(`${root}/helper/path`)
const { writeFileSync, ensureFileSync } = require('fs-extra')

const writeFile = (path, content) => {
    ensureFileSync(path)
    writeFileSync(path, content)
}

const ethicalFileComposerFileSystem = async (ctx, next, opts) => {
    const { dest, base } = opts
    const { file: { path, contents, map } } = ctx
    const destPath = resolveDestPath(path, dest, base)

    writeFile(destPath, contents)

    if (map) {
        const mapDestPath = destPath + '.map'
        writeFile(mapDestPath, map)
    }

    await next()
}

const ethicalFileComposerFileSystemInit = (opts = {}) => (
    async (ctx, next) => (
        await ethicalFileComposerFileSystem(ctx, next, opts)
    )
)

module.exports = ethicalFileComposerFileSystemInit
