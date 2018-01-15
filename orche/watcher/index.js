const root = '../../'
const { absolute } = require(`${root}/helper/path`)
const { onExit } = require(`${root}/helper/exit`)
const fileQueue = require(`${root}/helper/queue`)
const { join } = require('path')
const nsfw = require('nsfw')
const Vinyl = require('vinyl')
const { readFileSync, lstatSync } = require('fs-extra')
const { uniqWith, isEqual } = require('lodash')

const NSFW_ACTIONS = {
    0: 'CREATED',
    1: 'DELETED',
    2: 'MODIFIED',
    3: 'RENAMED'
}

const isDirectory = path => lstatSync(path).isDirectory()

const resolveContents = (path, state) => {
    if (state === 'DELETED' || isDirectory(path)) {
        return null
    }
    return readFileSync(path)
}

const makeFile = event => {
    const { action, directory, newFile, file = newFile } = event
    const path = join(directory, file)
    const state = NSFW_ACTIONS[action]
    const contents = resolveContents(path, state)
    return new Vinyl({ path, state, contents })
}

const watcherAPI = (watcher) => {
    let running = true
    return {
        stop: async () => {
            if (running) {
                await watcher.stop()
                running = false
            }
        }
    }
}

const normalizeEvents = events => (
    uniqWith(events, isEqual)
    .map(makeFile)
)

const watcher = async (directory, callback) => {
    if (typeof callback !== 'function') {
        callback = (file) => {
            const { path, state } = file
            console.log(`File (${path}) has been ${state.toLowerCase()}.`)
        }
    }
    let chain = Promise.resolve()
    const watcher = await nsfw(absolute(directory), events => {
        try{
            normalizeEvents(events).forEach(file => {

                queue.enqueue(file)
                chain = (
                    chain
                    .then(() => queue.dequeue())
                    .then(() => callback(file))
                    .catch(e => console.error(e))
                )
            })
        } catch (e) {
            //
            //
            //
            //
            //
            //
            //
            //
            console.error(e)
        }
    })
    const queue = fileQueue()
    await watcher.start()
    onExit(async () => {
        await instance.stop()
    })
    const instance = watcherAPI(watcher)
    return instance
}

module.exports = watcher
