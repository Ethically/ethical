const root = '../../..'
const { exit } = require(`${root}/helper/exit`)

const state = { server: null }

const manageServer = async ({ action, file }) => {

    if (action === 'SERVER_START') {
        try {
            const server = require(file).default
            const { server: instance } = await server
            state.server = instance
        } catch (e) {
            console.error(e)
            exit(1)
        }
        process.send({ action: 'SERVER_STARTED' })
    }

    if (action === 'SERVER_STOP') {
        await state.server.destroy()
        exit()
    }
}

process.on('message', manageServer)
