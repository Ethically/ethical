const { onExit, exit } = require('../../index.js')

describe('onExit()', () => {
    let processExit
    before(() => {
        processExit = process.exit
        process.exit = () => {}
    })
    after(() => {
        process.exit = processExit
    })
    it('should register exit callback', async (done) => {
        const prepareToExit = jasmine.createSpy('prepareToExit')
        onExit(prepareToExit)
        await exit()
        expect(prepareToExit).toHaveBeenCalled()
        done()
    })
    it('should register multiple exit callback', async (done) => {
        const prepareToExitOne = jasmine.createSpy('prepareToExitOne')
        onExit(prepareToExitOne)
        const prepareToExitTwo = jasmine.createSpy('prepareToExitTwo')
        onExit(prepareToExitTwo)
        await exit()
        expect(prepareToExitOne).toHaveBeenCalled()
        expect(prepareToExitTwo).toHaveBeenCalled()
        done()
    })
    it('should exclude duplicate exit callback', async (done) => {
        const prepareToExit = jasmine.createSpy('prepareToExit')
        onExit(prepareToExit)
        onExit(prepareToExit)
        await exit()
        expect(prepareToExit).toHaveBeenCalledTimes(1)
        done()
    })
})

describe('exit()', () => {
    it('should exit node process', async (done) => {
        const exitSpy = jasmine.createSpy('exit')
        const processExit = process.exit
        process.exit = exitSpy
        await exit()
        expect(exitSpy).toHaveBeenCalled()
        process.exit = processExit
        done()
    })
    it('should exit node process with custom code', async (done) => {
        const exitSpy = jasmine.createSpy('exit')
        const processExit = process.exit
        process.exit = exitSpy
        await exit(100)
        expect(exitSpy).toHaveBeenCalledWith(100)
        process.exit = processExit
        done()
    })
    it('should execute custom exit callback', async (done) => {
        const exitSpy = jasmine.createSpy('exit')
        await exit(exitSpy)
        expect(exitSpy).toHaveBeenCalled()
        done()
    })
})
