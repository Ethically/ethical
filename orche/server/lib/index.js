const root = '../../..'
const { absolute } = require(`${root}/helper/path`)
const { onExit } = require(`${root}/helper/exit`)
const startServer = require('./manager')

const state = {
    destroyServer: undefined,
    onExitHook: undefined
}

const serverManager = async ({ setup }, next, config) => {

    if (setup) {
        return
    }

    const { path } = config

    if (state.destroyServer) {
        await state.onExitHook()
    }

    const file = absolute(path)
    const onError = async (e) => {
        console.error(e)
        delete state.destroyServer
    }

    try {
        state.destroyServer = await startServer({ file, onError })
    } catch (e) {
        console.error(e)
    }

    if (state.onExitHook) {
        return await next()
    }

    state.onExitHook = async () => {
        if (state.destroyServer) {
            try {
                await state.destroyServer()
            } catch (e) {
                console.error(e)
            }
            delete state.destroyServer
        }
    }

    onExit(state.onExitHook)

    await next()
}

const serverManagerInit = (config = {}) => (
    async (ctx, next) => (
        await serverManager(ctx, next, config)
    )
)

module.exports = serverManagerInit
