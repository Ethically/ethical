const root = '../../..'
const { absolute } = require(`${root}/helper/path`)
const createPromiseCollector = require(`${root}/helper/collect`)
const { default: PromiseProvider } = require(`${root}/react/provider`)
const getInitScripts = require(`${root}/client/scripts`)
const React = require('react')
const { createStore, combineReducers } = require('redux')
const { Provider } = require('react-redux')
const { renderToString, renderToStaticMarkup } = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')
const { Helmet } = require('react-helmet')
const { graphql, buildSchema } = require('graphql')

const reactReduxMiddleware = async (ctx, next, config) => {
    const { method, request, response } = ctx
    const { body } = response
    if (body !== undefined) {
        return await next()
    }

    const { routes, layout, reducers, graphqlSchema, graphqlRoot } = config
    const { url } = request
    const { default: Layout } = require(absolute(layout))
    const { default: Routes } = require(absolute(routes))
    const { default: reducer } = require(absolute(reducers))
    const promise = createPromiseCollector()
    const store = createStore(combineReducers(reducer))
    const html = await renderRoute({ url, Routes, store, promise })
    const root = <ethical-root dangerouslySetInnerHTML={ { __html: html } } />
    const helmet = Helmet.renderStatic()
    const scripts = getInitScripts(store.getState())
    const props = {
        html: helmet.htmlAttributes.toComponent(),
        body: helmet.bodyAttributes.toComponent(),
        title: helmet.title.toComponent(),
        meta: helmet.meta.toComponent(),
        link: helmet.link.toComponent(),
        scripts,
        root
    }

    response.body = renderLayout(Layout, props)

    await next()
}

const reactReduxMiddlewareInit = (config) => (
    async (ctx, next) => await reactReduxMiddleware(ctx, next, config)
)

const renderRoute = async (context) => {
    const router = {}
    const html = await renderReactComponents({ ...context, router })
    const { url } = router
    if (url) {
        return renderRoute({ ...context, url })
    }
    return html
}

const renderReactComponents = async (context) => {

    const { url, router, Routes, store, promise } = context
    const render = () => renderToString(
        <PromiseProvider promise={promise}>
            <Provider store={store}>
                <StaticRouter context={router} location={url}>
                    {/* {Routes} */}
                </StaticRouter>
            </Provider>
        </PromiseProvider>
    )

    const html = render()
    const promises = promise()
    const { length } = promises
    if (length === 0) {
        return html
    }

    await Promise.all(promises)
    return render()
}

const renderLayout = (Layout, props) => renderToStaticMarkup(
    <Layout { ...{ ...props} } />
)

module.exports = reactReduxMiddlewareInit
