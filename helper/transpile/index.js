const root = '../..'
const path = require(`${root}/helper/path`)
const babel = require('babel-core')
const recursiveReadSync = require('recursive-readdir-sync')
const { ensureFileSync, readFileSync, writeFileSync } = require('fs-extra')

const resolveFiles = (files) => (
    files.filter(file => file.endsWith('.js'))
)

const transpileFiles = ({ src, dest, config }) => {

    const files = recursiveReadSync(path.absolute(src))
    const resolvedFiles = resolveFiles(files)

    resolvedFiles.forEach(file => {
        const originalSource = readFileSync(file, 'utf8')

        if (config.sourceMap) {
            config.sourceFileName = path.relative(file)
        }

        const source = babel.transform(originalSource, config)
        const newFilename = path.resolveDestPath(file, dest, src)
        ensureFileSync(newFilename)
        writeFileSync(newFilename, source.code)

        if (!source.map) {
            return
        }

        writeFileSync(newFilename + '.map', JSON.stringify(source.map))
    })
}

module.exports = transpileFiles
