const createPromiseCollector = require('../../index.js')

const promise = createPromiseCollector()

describe('createPromiseCollector()', () => {
    it('should collect promise', (done) => {
        const promiseOne = Promise.resolve(1)
        const promiseTwo = Promise.resolve(2)

        promise(promiseOne)
        promise(promiseTwo)

        const promises = promise()

        Promise
        .all(promises)
        .then(([ one, two ]) => {
            expect(one).toBe(1)
            expect(two).toBe(2)
        })
        .then(done)
        .catch(e => console.error(e.stack))
    })
    it('should collect return the input promise', (done) => {
        const promiseOne = Promise.resolve(1)
        const returnedPromise = (
            promise(promiseOne)
            .then(value => expect(value).toBe(1))
        )

        expect(returnedPromise).toEqual(promiseOne)

        const promises = promise()

        Promise
        .all(promises)
        .then(([ value ]) => {
            expect(value).toBe(1)
        })
        .then(done)
        .catch(e => console.error(e.stack))
    })
})
