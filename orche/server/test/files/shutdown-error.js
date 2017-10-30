const ethicalServer = require('../../../../../utility/server')

module.exports = (
    ethicalServer()
    .use(ctx => ctx.body = '{{ DEFAULT_BODY }}')
    .listen()
    .then(destroyServer => async () => {
        await destroyServer()
        process.exit(1)
    })
)
