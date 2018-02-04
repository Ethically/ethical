const { graphql, buildSchema } = require('graphql')

const graphqlMiddlewareInit = async (ctx, next, config = {}) => {

    const { method, request } = ctx
    const { path: requestedPath } = request
    const isJSON = request.is('application/json')
    const { path = '/graphql' } = config

    if (path !== requestedPath || method !== 'POST' || !isJSON) {
        return await next()
    }

    const { schema, root } = config
    const { body } = request
    const { query, variables } = body
    const graphqlSchema = buildSchema(schema)
    const result = await graphql(graphqlSchema, query, root, ctx, variables)
    const { response } = ctx

    response.body = JSON.stringify(result)
}

const graphqlMiddleware = config => (
    async (ctx, next) => await graphqlMiddlewareInit(ctx, next, config)
)

module.exports = graphqlMiddleware
