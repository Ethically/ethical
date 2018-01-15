const { join } = require('path')
const { name } = require('../../package.json')
const {
    isAppModule,
    isPackage,
    isAbsolutePackage,
    isRelativePackage,
    appendExtension,
    getAppPrefix,
    resolveAppModule,
    getRequire,
    requireModule
} = require('../../index.js')

const appModule = join(process.cwd(), 'app.js')
const testFile = join('&', 'test', 'files', 'a.js')

describe('isAppModule()', () => {
    it('should recognize local app files', () => {
        expect(isAppModule('&/app.js')).toBe(true)
    })
    it('should ignore named modules', () => {
        expect(isAppModule('app')).toBe(false)
    })
    it('should ignore relative named modules', () => {
        expect(isAppModule('app/file.js')).toBe(false)
    })
    it('should ignore absolute paths', () => {
        expect(isAppModule('/app.js')).toBe(false)
    })
    it('should recognize relative paths', () => {
        expect(isAppModule('./app.js')).toBe(false)
        expect(isAppModule('../app.js')).toBe(false)
    })
})

describe('isPackage()', () => {
    it('should recognize named modules', () => {
        expect(isPackage('app')).toBe(true)
    })
    it('should recognize relative named modules', () => {
        expect(isPackage('app/file.js')).toBe(true)
    })
    it('should recognize local app files', () => {
        expect(isPackage('&/app.js')).toBe(true)
    })
    it('should ignore absolute paths', () => {
        expect(isPackage('/app.js')).toBe(false)
    })
    it('should ignore relative paths', () => {
        expect(isPackage('./app.js')).toBe(false)
        expect(isPackage('../app.js')).toBe(false)
    })
})

describe('isAbsolutePackage()', () => {
    it('should recognize named modules', () => {
        expect(isAbsolutePackage('app')).toBe(true)
    })
    it('should ignore filenames', () => {
        expect(isAbsolutePackage('app.js')).toBe(true)
    })
    it('should ignore relative named modules', () => {
        expect(isAbsolutePackage('app/file.js')).toBe(false)
    })
    it('should ignore local app files', () => {
        expect(isAbsolutePackage('&/app.js')).toBe(false)
    })
    it('should ignore absolute paths', () => {
        expect(isAbsolutePackage('/app.js')).toBe(false)
    })
    it('should ignore relative paths', () => {
        expect(isAbsolutePackage('./app.js')).toBe(false)
        expect(isAbsolutePackage('../app.js')).toBe(false)
    })
})

describe('isRelativePackage()', () => {
    it('should recognize relative named modules', () => {
        expect(isRelativePackage('app/file.js')).toBe(true)
    })
    it('should recognize local app files', () => {
        expect(isRelativePackage('&/app.js')).toBe(true)
    })
    it('should ignore named modules', () => {
        expect(isRelativePackage('app')).toBe(false)
    })
    it('should ignore absolute paths', () => {
        expect(isRelativePackage('/app.js')).toBe(false)
    })
    it('should ignore relative paths', () => {
        expect(isRelativePackage('./app.js')).toBe(false)
        expect(isRelativePackage('../app.js')).toBe(false)
    })
})

describe('appendExtension()', () => {
    it('should append JavaScript extension to relative paths', () => {
        expect(appendExtension('./app')).toBe('./app.js')
        expect(appendExtension('../app')).toBe('../app.js')
    })
    it('should append JavaScript extension to absolute paths', () => {
        expect(appendExtension('/app')).toBe('/app.js')
    })
    it('should append custom JavaScript extension', () => {
        expect(appendExtension('app/file', 'json')).toBe('app/file.json')
    })
    it('should not append JavaScript extension to files that already contain it', () => {
        expect(appendExtension('app/file.js')).toBe('app/file.js')
        expect(appendExtension('app/file.json', 'json')).toBe('app/file.json')
        expect(appendExtension('app/file.js', 'json')).toBe('app/file.js.json')
    })
    it('should not append JavaScript extension to named modules', () => {
        expect(appendExtension('app')).toBe('app')
        expect(appendExtension('app', 'js')).toBe('app')
        expect(appendExtension('app.module', 'js')).toBe('app.module')
    })
})

describe('getAppPrefix()', () => {
    it('should return a tilde character', () => {
        expect(getAppPrefix()).toBe('&')
    })
})

describe('resolveAppModule()', () => {
    it('should transform app file names into absolute paths', () => {
        expect(resolveAppModule('&/app.js')).toBe(appModule)
    })
    it('should return input when it is an absolute path', () => {
        expect(resolveAppModule('/app.js')).toBe('/app.js')
    })
    it('should return input when it is a named module', () => {
        expect(resolveAppModule('app')).toBe('app')
    })
    it('should return input when it is a relative named module', () => {
        expect(resolveAppModule('app/file.js')).toBe('app/file.js')
    })
    it('should return absolute paths when it is a relative path', () => {
        expect(resolveAppModule('./app.js')).toBe(appModule)
        expect(resolveAppModule(`../${name}/app.js`)).toBe(appModule)
    })
})

describe('getRequire()', () => {
    it('should return require function', () => {
        expect(getRequire().toString()).toEqual(require.toString())
    })
})

describe('requireModule()', () => {
    it('should require module', () => {
        expect(requireModule(testFile)).toEqual({ default: 'Hello World!' })
    })
})
