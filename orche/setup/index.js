const Vinyl = require('vinyl')
const { readFileSync, lstatSync } = require('fs')
const glob = require('glob')

const isFile = (path) => !lstatSync(path).isDirectory()
const run = async (tasks, pattern) => {
    const files = glob.sync(pattern).filter(isFile)
    const next = async (index = 0) => {
        if (!files[index]) {
            return
        }
        const path = files[index]
        const state = 'MODIFIED'
        const contents = readFileSync(path)
        const file = new Vinyl({ path, state, contents })
        const setup = files.length - index - 1
        await tasks({ file, setup })
        await next(index + 1)
    }
    return next()
}

module.exports = run
