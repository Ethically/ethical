const { fork } = require('child_process')
const { join } = require('path')

const startServer = ({ file, onError }) => (
    new Promise((resolve, reject) => {
        const startupError = (code) => {
            reject(new Error('Server stopped unexpectedly on startup!'))
        }
        const server = fork(join( __dirname, 'server.js'))
        server.on('close', startupError)
        server.on('message', () => {
            const unexpectedError = () => {
                onError(new Error('Server stopped unexpectedly!'))
            }
            server.on('close', unexpectedError)
            server.removeListener('close', startupError)
            resolve(stopServer(server, unexpectedError))
        })
        server.send({ action: 'SERVER_START', file })
    })
)

const stopServer = (server, unexpectedError) => () => (
    new Promise((resolve, reject) => {
        const shutdown = (code) => {
            if (code === 0) {
                return resolve()
            }
            reject(new Error('Server stopped unexpectedly on shutdown!'))
        }
        server.on('close', shutdown)
        server.removeListener('close', unexpectedError)
        server.send({ action: 'SERVER_STOP' })
    })
)

module.exports = startServer
