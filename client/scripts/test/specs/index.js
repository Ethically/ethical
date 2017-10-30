import React from 'react'
import { shallow } from 'enzyme'
import { getAppPrefix } from 'ethical-utility-resolve-module'
import getInitScripts from '../../src/index.js'

const app = getAppPrefix()
const entry = '~/dist/browser/entry.js'
const scriptRoot = '/node_modules/ethical-scripts-frontend/dist/'
const beforeScript = `
    window.global = window
    window.process = { env: {} }
    window.state = JSON.parse('{}')
`
const initScript = `
    window.require
        .load('module?exclude=' + window.require.ids.toString())
        .then(() => setTimeout(() => window.require('${app}'), 0))
        .catch(e => console.error(e))
`

describe('getInitScripts()', () => {

    it('should output development scripts', () => {
        process.env.NODE_ENV = 'development'
        const [ before, external, inline ] = getInitScripts()
        const src = scriptRoot + 'development.js'
        expect(shallow(before).html()).toBe(`<script>${beforeScript}</script>`)
        expect(shallow(external).html()).toBe(`<script src="${src}"></script>`)
        expect(shallow(inline).html()).toBe(`<script>${initScript}</script>`)
    })

    it('should output production scripts', () => {
        process.env.NODE_ENV = 'production'
        const [ before, external, inline ] = getInitScripts()
        const src = scriptRoot + 'production.js'
        expect(shallow(before).html()).toBe(`<script>${beforeScript}</script>`)
        expect(shallow(external).html()).toBe(`<script src="${src}"></script>`)
        expect(shallow(inline).html()).toBe(`<script>${initScript}</script>`)
    })

    it('should output "NODE_ENV_UNDEFINED" as script name', () => {
        delete process.env.NODE_ENV
        const [ before, external, inline ] = getInitScripts()
        const src = scriptRoot + 'NODE_ENV_UNDEFINED.js'
        expect(shallow(before).html()).toBe(`<script>${beforeScript}</script>`)
        expect(shallow(external).html()).toBe(`<script src="${src}"></script>`)
        expect(shallow(inline).html()).toBe(`<script>${initScript}</script>`)
    })

    it('should include state object', () => {
        delete process.env.NODE_ENV
        const state = { hello: 'world' }
        const stateString = JSON.stringify({ hello: 'world' })
        const [ before, external, inline ] = getInitScripts(state)
        const beforeState = beforeScript.replace("'{}'", `'${stateString}'`)
        expect(shallow(before).html()).toBe(`<script>${beforeState}</script>`)
    })
})
