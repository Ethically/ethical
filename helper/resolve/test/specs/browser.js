const { join } = require('path')
const { getRequire, requireModule } = require('../../src/index.js')

const testFile = join('&', 'test', 'files', 'a.js')

const browserRequire = (path) => path

const nodeProcess = process

const browserify = () => {
    global.window = { require: browserRequire }
    process = { ...nodeProcess, versions: null }
}

const nodify = () => {
    process = nodeProcess
    delete global.window
}

describe('getRequire()', () => {
    before(browserify)
    after(nodify)
    it('should return browser require function', () => {
        expect(getRequire()).toBe(browserRequire)
    })
})

describe('requireModule()', () => {
    before(browserify)
    after(nodify)
    it('should require module', () => {
        expect(requireModule(testFile)).toBe(testFile)
    })
})
