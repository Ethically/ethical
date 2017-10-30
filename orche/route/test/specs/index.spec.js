const Vinyl = require('vinyl')
const { series } = require('../../../../../composer/utility')
const route = require('../../index.js')

describe('route()', () => {

    it('should call next middleware', async (done) => {
        const nextMiddleware = jasmine.createSpy('nextMiddleware')
        const resolve = series(route('src/*.js'), nextMiddleware)
        const path = 'src/index.js'
        const file = new Vinyl({ path })
        const ctx = { file }
        await resolve(ctx)
        expect(nextMiddleware).toHaveBeenCalled()
        done()
    })

    it('should not call next middleware', async (done) => {
        const nextMiddleware = jasmine.createSpy('nextMiddleware')
        const resolve = series(route('dist/*.js'), nextMiddleware)
        const path = 'src/index.js'
        const file = new Vinyl({ path })
        const ctx = { file }
        await resolve(ctx)
        expect(nextMiddleware).not.toHaveBeenCalled()
        done()
    })
})
