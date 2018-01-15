const root = '../../..'
const { setProjectRoot } = require(`${root}/helper/resolve-node`)
const { absolute } = require(`${root}/helper/path`)
const createPromiseCollector = require(`${root}/helper/collect`)
const { default: PromiseProvider } = require(`${root}/react/provider`)
const getInitScripts = require(`${root}/client/scripts`)
const React = require('react')
const { createStore, combineReducers } = require('redux')
const { Provider } = require('react-redux')
const { renderToString, renderToStaticMarkup } = require('react-dom/server')
const { StaticRouter } = require('react-router-dom')
const { Helmet } = require(`${root}/react/helmet`)
const { graphql, buildSchema } = require('graphql')

const setGlobals = (request) => {

    if (request) {
        global.navigator = { userAgent: request.headers['user-agent'] }
    }

    const resetProjectRoot = setProjectRoot(module.parent.parent.id)

    return () => {
        resetProjectRoot()
        delete global.navigator
    }
}

const resolveLayoutProps = (html, store) => {
    const root = <ethical-root dangerouslySetInnerHTML={ { __html: html } } />
    const scripts = getInitScripts(store.getState())
    const helmet = Helmet.renderStatic()
    const props = {
        html: helmet.htmlAttributes.toComponent(),
        body: helmet.bodyAttributes.toComponent(),
        title: helmet.title.toComponent(),
        meta: helmet.meta.toComponent(),
        link: helmet.link.toComponent(),
        scripts,
        root
    }
    return props
}

const reactReduxMiddleware = async (ctx, next, config) => {
    const { method, request, response } = ctx
    const { body } = response
    if (body !== undefined) {
        return await next()
    }

    const {  Layout, Routes, reducer, graphqlSchema, graphqlRoot } = config
    const { url } = request

    const promise = createPromiseCollector()
    const store = createStore(combineReducers(reducer))
    const props = await renderRoute({ url, Routes, store, promise, request })

    response.body = renderLayout(Layout, props)

    await next()
}

const renderRoute = async (context) => {
    const router = {}
    const props = await renderReactComponents({ ...context, router })
    const { url } = router
    if (url) {
        return renderRoute({ ...context, url })
    }
    return props
}

const renderReactComponents = async (context) => {

    const { url, router, Routes, store, promise, request } = context
    const render = () => renderToString(
        <PromiseProvider promise={promise}>
            <Provider store={store}>
                <StaticRouter context={router} location={url}>
                    {Routes}
                </StaticRouter>
            </Provider>
        </PromiseProvider>
    )

    const resetGlobals = setGlobals(request)
    const html = render()
    resetGlobals()

    const promises = promise()
    const { length } = promises
    if (length === 0) {
        return resolveLayoutProps(html, store)
    }

    await Promise.all(promises)

    const resetGlobalsAgain = setGlobals(request)
    const final = render()
    resetGlobalsAgain()

    return resolveLayoutProps(final, store)
}

const renderLayout = (Layout, props) => renderToStaticMarkup(
    <Layout { ...{ ...props} } />
)

const bootstrap = (config) => {

    const resetGlobals = setGlobals()

    const { routes, layout, reducers, ...other } = config

    const { default: Layout } = require(absolute(layout))
    const { default: Routes } = require(absolute(routes))
    const { default: reducer } = require(absolute(reducers))

    resetGlobals()

    return { Layout, Routes, reducer, ...other }
}

const reactReduxMiddlewareInit = (config) => {
    const resolvedConfig = bootstrap(config)
    return (
        async (ctx, next) => (
            await reactReduxMiddleware(ctx, next, resolvedConfig)
        )
    )
}

module.exports = reactReduxMiddlewareInit
