const { join } = require('path')
const fetch = require('node-fetch')
const ethicalServer = require('../../../../utility/server')
const htmlMiddleware = require('../../index.js')

const baseURL = 'http://localhost:8080'
const appPath = join('test', 'files', 'dist')
const defaultConfig = {
    routes: join(appPath, 'Routes.js'),
    layout: join(appPath, 'Layout.js'),
    reducers: join(appPath, 'reducers', 'index.js')
}

const startServer = ({
    config = defaultConfig,
    requests = () => {},
    beforeMiddleware = (ctx, next) => next()
}) => (
    ethicalServer()
    .use(beforeMiddleware)
    .use(htmlMiddleware(config))
    .listen()
    .then(destroyServer => {
        return new Promise(async resolve => {
            await requests()
            resolve(destroyServer)
        })
    })
    .then(destroyServer => destroyServer())
)
const beforeScript = `
    window.global = window
    window.process = { env: {} }
    window.state = JSON.parse('{"welcome":null}')
`
const initScript = `
    window.require
        .load('module?exclude=' + window.require.ids.toString())
        .then(() => setTimeout(() => window.require('~'), 0))
        .catch(e => console.error(e))
`
describe('htmlMiddleware()', () => {
    it('should return the html for the home page', (done) => {
        const html = (
            '<html>' +
                '<head>' +
                    '<title data-react-helmet="true">Default Title</title>' +
                    '<meta data-react-helmet="true" name="description" content="Default Description"/>' +
                '</head>' +
                '<body>' +
                    '<ethical-root>' +
                    '<ethical-react-root data-reactroot="" data-reactid="1" data-react-checksum="1833583753">' +
                        '<!-- react-empty: 2 -->' +
                        '<page data-reactid="3">Hello from home!</page>' +
                        '<!-- react-empty: 4 -->' +
                        '<!-- react-empty: 5 -->' +
                        '<!-- react-empty: 6 -->' +
                    '</ethical-react-root>' +
                    '</ethical-root>' +
                    '<script>' + beforeScript + '</script>' +
                    '<script src="/node_modules/ethical-scripts-frontend/dist/NODE_ENV_UNDEFINED.js"></script>' +
                    '<script>' + initScript + '</script>' +
                '</body>' +
            '</html>'
        )
        const requests = async () => {
            const response = await fetch(baseURL)
            const text = await response.text()
            expect(text).toBe(html)
        }
        startServer({ requests })
        .then(done)
        .catch(e => console.error(e))
    })
    it('should return the html for the lazy query page with async data', (done) => {
        const state = '"Welcome to the Ethical framework!"'
        const html = (
            '<html>' +
                '<head>' +
                    '<title data-react-helmet="true">Default Title</title>' +
                    '<meta data-react-helmet="true" name="description" content="Default Description"/>' +
                '</head>' +
                '<body>' +
                    '<ethical-root>' +
                        '<ethical-react-root data-reactroot="" data-reactid="1" data-react-checksum="177294944">' +
                            '<!-- react-empty: 2 -->' +
                            '<!-- react-empty: 3 -->' +
                            '<greeting data-reactid="4">Welcome to the Ethical framework!</greeting>' +
                            '<!-- react-empty: 5 -->' +
                            '<!-- react-empty: 6 -->' +
                        '</ethical-react-root>' +
                    '</ethical-root>' +
                    '<script>' + beforeScript.replace('null', state) + '</script>' +
                    '<script src="/node_modules/ethical-scripts-frontend/dist/NODE_ENV_UNDEFINED.js"></script>' +
                    '<script>' + initScript + '</script>' +
                '</body>' +
            '</html>'
        )
        const requests = async () => {
            const response = await fetch(baseURL + '/async')
            const text = await response.text()
            expect(text).toBe(html)
        }
        startServer({ requests })
        .then(done)
        .catch(e => console.error(e))
    })
    it('should return the html for the redirected page', (done) => {
        const html = (
            '<html>' +
                '<head>' +
                    '<title data-react-helmet="true">Default Title</title>' +
                    '<meta data-react-helmet="true" name="description" content="Default Description"/>' +
                '</head>' +
                '<body>' +
                    '<ethical-root>' +
                        '<ethical-react-root data-reactroot="" data-reactid="1" data-react-checksum="1825851099">' +
                            '<!-- react-empty: 2 -->' +
                            '<!-- react-empty: 3 -->' +
                            '<!-- react-empty: 4 -->' +
                            '<!-- react-empty: 5 -->' +
                            '<page data-reactid="6">Hello from Redirected!</page>' +
                        '</ethical-react-root>' +
                    '</ethical-root>' +
                    '<script>' + beforeScript + '</script>' +
                    '<script src="/node_modules/ethical-scripts-frontend/dist/NODE_ENV_UNDEFINED.js"></script>' +
                    '<script>' + initScript + '</script>' +
                '</body>' +
            '</html>'
        )
        const requests = async () => {
            const response = await fetch(baseURL + '/redirect')
            const text = await response.text()
            expect(text).toBe(html)
        }
        startServer({ requests })
        .then(done)
        .catch(e => console.error(e))
    })
    it('should do nothing when body is already provided', (done) => {
        const requests = async () => {
            const response = await fetch(baseURL)
            const text = await response.text()
            expect(text).toBe('Hello World!')
        }
        const beforeMiddleware = async (ctx, next) => {
            const { response } = ctx
            response.body = 'Hello World!'
            await next()
        }
        startServer({ requests, beforeMiddleware })
        .then(done)
        .catch(e => console.error(e))
    })
})
