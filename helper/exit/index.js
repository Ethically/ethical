const exitHook = require('async-exit-hook')

const callbacks = new Set()

const runExitCallbacks = () => {
    const promises = Array.from(callbacks).map(async (callback) => {
        return await callback()
    })
    return Promise.all(promises)
}

const onExit = (callback) => callbacks.add(callback)

const exit = async (code = 0) => {
    await runExitCallbacks()
    if (typeof code === 'function') {
        return code()
    }
    process.exit(code)
}

exitHook(exit)

module.exports = { onExit, exit }
