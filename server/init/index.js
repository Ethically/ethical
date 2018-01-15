const Koa = require('koa')
const serverDestroy = require('server-destroy')
const bunyan = require('bunyan')

const defaultLogger = bunyan.createLogger({
    name: 'ethical-server'
})

const ethicalServer = (config = {}) => {
    const { log = defaultLogger } = config
    const app = new Koa()
    const api = {
        use: (middleware) => {
            const wrapper = async (ctx, next) => {
                try {
                    await middleware(ctx, next)
                } catch (err) {
                    log.error(err)
                    process.exit(1)
                }
            }
            app.use(wrapper)
            return api
        },
        listen: (port = 9090) => new Promise(resolve => {
            log.info(`Starting Server on Port: ${port}`)
            const server = app.listen(port, () => {
                serverDestroy(server)
                const destroy = server.destroy
                server.destroy = () => {
                    return new Promise(resolve => destroy.call(server, resolve))
                }
                resolve({ app, server })
            })
        })
    }
    return api
}

module.exports = ethicalServer
