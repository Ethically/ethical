const root = '../..'
const { resolveDestPath } = require(`${root}/helper/path`)
const { writeFileSync, ensureFileSync } = require('fs-extra')

const writeFile = (path, content) => {
    ensureFileSync(path)
    writeFileSync(path, content)
}

const ethicalFileComposerFileSystem = async (ctx, next, config) => {
    const { dest, base } = config
    const { file: { path, contents, map, error } } = ctx
    const destPath = resolveDestPath(path, dest, base)

    if (error) {
        return await next()
    }

    writeFile(destPath, contents)

    if (map) {
        const mapDestPath = destPath + '.map'
        writeFile(mapDestPath, map)
    }

    await next()
}

const ethicalFileComposerFileSystemInit = (config = {}) => (
    async (ctx, next) => (
        await ethicalFileComposerFileSystem(ctx, next, config)
    )
)

module.exports = ethicalFileComposerFileSystemInit
