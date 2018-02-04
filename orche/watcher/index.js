const root = '../../'
const { absolute } = require(`${root}/helper/path`)
const { onExit } = require(`${root}/helper/exit`)
const fileQueue = require(`${root}/helper/queue`)
const { join } = require('path')
const Vinyl = require('vinyl')
const { readFileSync, lstatSync } = require('fs-extra')
const { uniqWith, isEqual } = require('lodash')
const watch = require('recursive-watch')

const resolveContents = (path, state) => {
    if (state === 'DELETED') {
        return null
    }
    return readFileSync(path)
}

const makeFile = (path, event) => {
    const contents = resolveContents(path, event)
    return new Vinyl({ path, contents, state: event })
}

const detectFileEvent = (file) => {
    try {
        const stats = lstatSync(file)
        if (stats.isDirectory()) {
            return null
        }
        return 'MODIFIED'
    } catch (err) {
        return 'DELETED'
    }
}

const watcher = async (directory, callback) => {

    if (typeof callback !== 'function') {
        callback = (file) => {
            const { path, state } = file
            console.log(`File (${path}) has been ${state.toLowerCase()}.`)
        }
    }

    let chain = Promise.resolve()

    const queue = fileQueue()
    const processing = new Set([])

    const unwatch = watch(absolute(directory), (path) => {

        const event = detectFileEvent(path)
        const key = path + ':' + event

        if (!['MODIFIED', 'DELETED'].includes(event) || processing.has(key)) {
            return
        }

        processing.add(key)

        queue.enqueue(makeFile(path, event))

        chain = (
            chain
            .then(() => queue.dequeue())
            .then(file => {
                const { path, state } = file
                processing.delete(path + ':' + state)
                return callback(file)
            })
            .catch(e => console.error(e))
        )
    })

    onExit(() => {
        unwatch()
    })

    return unwatch
}

module.exports = watcher
