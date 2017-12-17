const Koa = require('koa')
const serverDestroy = require('server-destroy')

const ethicalServer = (opts = {}) => {
    const port = ( parseInt(opts.port) ? opts.port : 8080 )
    const app = new Koa()
    const api = {
        use: (middleware) => {
            const wrapper = async (ctx, next) => {
                try {
                    await middleware(ctx, next)
                } catch (e) {
                    console.error(`Middleware (${middleware}): ${e.stack}`)
                    process.exit(1)
                }
            }
            app.use(wrapper)
            return api
        },
        listen: () => new Promise(resolve => {
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
