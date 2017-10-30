const isNode = require('../../index.js')

describe('isNode()', () => {
    it('should return true', () => {
        expect(isNode()).toBe(true)
    })
})
