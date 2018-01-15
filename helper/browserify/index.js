const { JSDOM } = require('jsdom')
const url = require('url')

const browserify = (request = {}) => {

    const { headers = {} } = request
    const {
        'user-agent': userAgent = 'NOT_SUPPLIED',
        'referer': referer
    } = headers
    const html = `<body><ethical-root></ethical-root></body>`
    const config = {
        url: 'http://localhost:8080/',
        userAgent
    }
    const { window } = new JSDOM(html, config)

    global.window = window
    global.document = window.document
    global.location = window.location
    global.navigator = window.navigator
    global.history = window.history
    global.localStorage = window.localStorage
    global.sessionStorage = window.sessionStorage

    global.history.pushState(
        {}, 'Default Title', referer && url.parse(referer).pathname
    )
}

const unbrowserify = () => {
    const document = global.document
    global.window =
    global.document =
    global.location =
    global.navigator =
    global.history =
    global.localStorage =
    global.sessionStorage = undefined
    return document
}

module.exports = { browserify, unbrowserify }
