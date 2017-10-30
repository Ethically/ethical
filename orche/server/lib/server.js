const root = '../../..'
const { exit } = require(`${root}/helper/exit`)

const state = { destroyServer: null }

const manageServer = async ({ action, file }) => {

    if (action === 'SERVER_START') {
        try {
            const server = require(file)
            const instance = await server
            state.destroyServer = instance
        } catch (e) {
            console.error(e)
            exit(1)
        }
        process.send({ action: 'SERVER_STARTED' })
    }

    if (action === 'SERVER_STOP') {
        await state.destroyServer()
        exit()
    }
}

process.on('message', manageServer)
