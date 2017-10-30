const ethicalServer = require('../../../utility/server')

module.exports = (
    ethicalServer()
    .use(ctx => ctx.body = '{{ DEFAULT_BODY }}')
    .listen()
    .then(destroyServer => {
        setTimeout(() => process.exit(1), 0)
        return destroyServer
    })
)
