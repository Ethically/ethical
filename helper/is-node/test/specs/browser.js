const isNode = require('../../index.js')

const nodeProcess = process

const browserify = () => {
    process = { ...nodeProcess, versions: null }
}

const nodify = () => {
    process = nodeProcess
}

describe('isNode()', () => {
    let nodeProcess = process
    before(browserify)
    after(nodify)
    it('should return false', () => {
        expect(isNode()).toBe(false)
    })
})
