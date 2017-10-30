import { JSDOM } from 'jsdom'
import createPromiseCollector from 'ethical-utility-promise-collector'
import PromiseProvider from 'ethical-react-component-provider-promise'
import promiser from '../../src/index.js'

const { window } = new JSDOM('')
const { document, navigator } = window

global.window = window
global.document = document
global.navigator = navigator

const React = require('react')
const { mount } = require('enzyme')
const { renderToString } = require('react-dom/server')

describe('promiser()', () => {
    it('should render provide a promise collector', async (done) => {
        const promiseCollector = createPromiseCollector()
        const Component = ({ promise }) => {
            expect(promise).toBe(promiseCollector)
            return <hello>Promise</hello>
        }
        const PromiserComponent = promiser(Component)
        const wrapper = mount(
            <PromiseProvider promise={promiseCollector}>
                <PromiserComponent />
            </PromiseProvider>
        )
        done()
    })

    it('should render passthrough all props', async (done) => {
        const promiseCollector = createPromiseCollector()
        const Component = ({ hello }) => {
            expect(hello).toBe('world')
            return <hello>World</hello>
        }
        const PromiserComponent = promiser(Component)
        const wrapper = mount(
            <PromiseProvider promise={promiseCollector}>
                <PromiserComponent hello='world' />
            </PromiseProvider>
        )
        done()
    })
})
