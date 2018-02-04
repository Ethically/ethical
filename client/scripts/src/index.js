const root = '../../..'
const { getAppPrefix } = require(`${root}/helper/resolve`)
const { join } = require('path-browserify')
const { readFileSync } = require('fs')
const React = require('react')

const app = getAppPrefix()
const scriptPath = '/node_modules/ethical/client/init/dist/'
const initScript = `
    window.require
        .load()
        .then(() => window.require('${app}'))
        .then(() => console.log('Done requiring server rendered modules!'))
        .catch(e => console.error(e))
`
const beforeScript = (state) => (`
    window.global = window
    window.process = { env: {} }
    window.state = JSON.parse('${JSON.stringify(state)}')
`)

const getInitScripts = (state = {}) => {
    const scriptName = (process.env.NODE_ENV || 'NODE_ENV_UNDEFINED') + '.js'
    const script = scriptPath + scriptName
    const before = beforeScript(state)
    return [
        <script key='0' dangerouslySetInnerHTML={{ __html: before }} />,
        <script key='1' src={script} />,
        <script key='2' dangerouslySetInnerHTML={{ __html: initScript }} />
    ]
}

module.exports = getInitScripts
