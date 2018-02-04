const { join } = require('path')
const { readFileSync } = require('fs')
const http = require('http')
const httpProxy = require('http-proxy')
const WebSocketServer = require('uws')
const bunyan = require('bunyan')

const log = bunyan.createLogger({
    name: 'ethical-proxy-server'
})

const state = {
    serving: false,
    timeoutDelays: [],
    promiseDelays: [],
    resolveDelay: () => {
        state.timeoutDelays.forEach((timeout) => {
            clearTimeout(timeout)
        })
        state.promiseDelays.forEach((resolve) => {
            resolve(resolve)
        })
        state.timeoutDelays = []
        state.promiseDelays = []
    }
}

const reload = readFileSync(join(__dirname, '../../../client/dev/index.js'))
const retry = (
    readFileSync(join(__dirname, './retry.html'), 'utf8')
    .replace('{{WEB_SOCKET}}', reload)
)

const handleError = (e, req, res) => {
    res.writeHead(500, {
        'Content-Type': 'text/html'
    })
    res.end(retry)
    res.reject(e)
}

const delay = (req, res) => (milliseconds) => new Promise((resolve, reject) => {
    state.timeoutDelays.push(setTimeout(() => {
        res.reject = reject
        const warn = 'Failed to restart server, please check for errors!'
        handleError(new Error(warn), req, res)
    }, milliseconds))
    state.promiseDelays.push(resolve)
})

const tryApp = (proxy) => async (req, res) => {
    if (!state.serving) {
        try {
            await delay(req, res)(3000)
        } catch (e) {
            log.warn(e.message)
            return
        }
    }

    const resEnd = res.end

    await new Promise((resolve, reject) => {
        res.end = (...args) => {
            resEnd.call(res, ...args)
            resolve()
        }
        res.reject = reject
        proxy.web(req, res)
    })
}

const startServer = () => (
    new Promise((resolve, reject) => {

        const proxy = new httpProxy.createProxyServer({
            target: {
                host: 'localhost',
                port: 9090
            }
        })

        proxy.on('error', handleError)

        const tryAppServer = tryApp(proxy)

        const proxyServer = http.createServer((req, res) => {
            tryAppServer(req, res)
        })

        proxyServer.on('error', reject)

        proxyServer.on('upgrade', (req, socket, head) => {
            proxy.ws(req, socket, head)
        })

        proxyServer.listen(8080, resolve)
    })
)

const startSocket = () => (
    new Promise((resolve, reject) => {
        const io = new WebSocketServer('ws://localhost:9393')
        io.on('open', () => resolve(io))
        io.on('error', reject)
    })
)

const init = async () => {

    try {

        await startServer()
        log.info('Server Started on port: 8080')

        const io = await startSocket()
        log.info('Socket Started on port: 8181')

        io.on('message', (message) => {
            log.info('Socket Message:', message)
            if (message === 'SERVER_START') {
                state.serving = true
                state.resolveDelay()
            }
            if (message === 'SERVER_STOP') {
                state.serving = false
            }
        })

    } catch (err) {
        return log.error(err)
    }
}

init()
