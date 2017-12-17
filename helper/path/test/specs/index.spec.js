const { join } = require('path')
const {
    isRelative,
    isAbsolute,
    relative,
    absolute,
    getRootPath,
    resolveDestPath
} = require('../../index.js')

const appModule = join(process.cwd(), 'app', 'path.js')

describe('resolveDestPath()', () => {
    it('should return resolved input path', () => {
        const file = join('app', 'path.js')
        expect(resolveDestPath(file)).toBe(appModule)
        expect(resolveDestPath(appModule)).toBe(appModule)
    })
    it('should return input destination file path', () => {
        const src = join('src', 'app', 'path.js')
        const dist = join('dist','app', 'path.js')
        const abslDist = join(process.cwd(), dist)
        expect(resolveDestPath(src, dist)).toBe(abslDist)
    })
    it('should return path relative to destination', () => {
        const src = join('src', 'file.js')
        const dest = join('dest')
        expect(resolveDestPath(src, 'dest', 'src'))
        .toBe(join(process.cwd(), dest, 'file.js'))

        const src1 = join('src', 'app', 'file.js')
        const dest1 = join('dest','app')
        expect(resolveDestPath(src1, 'dest', 'src'))
        .toBe(join(process.cwd(), dest1, 'file.js'))

        const src2 = join('src', 'app', 'file.js')
        const dest2 = join('dest', 'sub', 'app')
        expect(resolveDestPath(src2, 'dest/sub', 'src'))
        .toBe(join(process.cwd(), dest2, 'file.js'))
    })
})

describe('isRelative()', () => {
    it('should recognize relative paths', () => {
        expect(isRelative('./app.js')).toBe(true)
        expect(isRelative('../app.js')).toBe(true)
    })
    it('should ignore named modules', () => {
        expect(isRelative('app')).toBe(false)
    })
    it('should ignore relative named modules', () => {
        expect(isRelative('app/file.js')).toBe(false)
    })
    it('should ignore local app files', () => {
        expect(isRelative('&/app.js')).toBe(false)
    })
    it('should ignore absolute paths', () => {
        expect(isRelative('/app.js')).toBe(false)
    })
})

describe('isAbsolute()', () => {
    it('should recognize absolute paths', () => {
        expect(isAbsolute('/app.js')).toBe(true)
    })
    it('should ignore named modules', () => {
        expect(isAbsolute('app')).toBe(false)
    })
    it('should ignore relative named modules', () => {
        expect(isAbsolute('app/file.js')).toBe(false)
    })
    it('should ignore local app files', () => {
        expect(isAbsolute('&/app.js')).toBe(false)
    })
    it('should ignore relative paths', () => {
        expect(isAbsolute('./app.js')).toBe(false)
        expect(isAbsolute('../app.js')).toBe(false)
    })
})

describe('absolute()', () => {
    it('should return an absolute path', () => {
        expect(absolute('app/path.js')).toBe(appModule)
        expect(absolute('./app/path.js')).toBe(appModule)
    })
    it('should return same path when it\'s already absolute', () => {
        expect(absolute(appModule)).toBe(appModule)
    })
})

describe('relative()', () => {
    it('should return an relative path when path is already relative', () => {
        expect(relative('app/path.js')).toBe('app/path.js')
        expect(relative('./app/path.js')).toBe('./app/path.js')
    })
    it('should return an absolute path when path is not relative to root', () => {
        expect(relative('/app/path.js')).toBe('/app/path.js')
    })
    it('should return relative path', () => {
        expect(relative(appModule)).toBe('app/path.js')
    })
})

describe('getRootPath()', () => {
    it('should return the root of the project', () => {
        expect(getRootPath()).toBe(process.cwd())
    })
})
