const root = '../../..'
const { absolute } = require(`${root}/helper/path`)
const { onExit } = require(`${root}/helper/exit`)
const startServer = require('./manager')

const state = {
    destroyServer: null,
    onExitHook: null,
    onError: null,
    errors: {},
    io: null
}

const serverManager = async (ctx, next, config) => {

    const { path: server, log, io } = config
    const { setup, file: { path, error } } = ctx

    await state.onExitHook()

    if (error) {
        state.errors[path] = error
        return await next()
    }

    if (state.errors[path]) {
        delete state.errors[path]
    }

    if (setup) {
        return
    }

    const file = absolute(server)

    try {
        log.info('Starting server...')
        if (Object.keys(state.errors).length) {
            log.warn('Unresolved errors pending:')
            Object.values(state.errors).forEach((e) => log.error(e))
        }
        const { onError } = state
        state.destroyServer = await startServer({ file, onError })
        if (io) {
            io.send('SERVER_START')
        }
    } catch (e) {
        log.error(e)
    }

    await next()
}

const serverManagerInit = (config = {}) => {

    const { log, io } = config

    state.onExitHook =  async () => {
        if (state.destroyServer) {
            try {
                if (io) {
                    io.send('SERVER_STOP')
                }
                log.info('Detroying server...')
                await state.destroyServer()
            } catch (e) {
                log.error(e)
            }
            delete state.destroyServer
        }
    }

    onExit(state.onExitHook)

    state.onError = async (e) => {
        if (io) {
            io.send('SERVER_STOP')
        }
        log.error(e)
        delete state.destroyServer
    }

    return async (ctx, next) => (
        await serverManager(ctx, next, config)
    )
}

module.exports = serverManagerInit
