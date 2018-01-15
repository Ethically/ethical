const WebSocketServer = require('uws')
const stream = require('stream')
const util = require('util')

const clients = []

const io = {
    send: (message) => {
        clients.forEach(client => client.send(message))
    }
}

function socketStream(config = {}) {

    stream.Transform.call(this, config);

    const ready = () => config.ready && config.ready(io)

    const socket = new WebSocketServer.Server(config, ready)

    socket.on('connection', (io) => {
        clients.push(io)
    })

    socket.on('error', config.error)
}

util.inherits(socketStream, stream.Transform)

socketStream.prototype._transform = function (obj, encoding, done) {
    if (clients.length) {
        clients.forEach(client => client.send(obj))
    }
    this.push(obj)
    done()
}

const socket = ({ log }) => (
    new Promise((resolve, reject) => {
        const port = 9393
        const error = (e) => log.error(e)
        const ready = (io) => {
            resolve({ stream, io })
        }
        const stream = new socketStream({ port, ready, error })
    })
)

module.exports = socket
