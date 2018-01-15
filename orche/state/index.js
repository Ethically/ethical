const state = (opts = {}) => async (ctx, next) => {

    const { filter = [] } = opts
    const { file } = ctx

    if (filter.includes(file.state)) {
        await next()
    }
}

module.exports = state
