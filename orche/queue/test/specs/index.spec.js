const Vinyl = require('vinyl')
const fileQueue = require('../../index.js')

describe('fileQueue().enqueue()', () => {
    it('should accept Vinyl files', () => {
        const file = new Vinyl()
        const q = fileQueue()
        q.enqueue(file)
        expect(q.dequeue()).toBe(file)
        expect(q.isEnqueued('*.bar')).toBe(false)
    })

    it('should reject non-Vinyl files', () => {
        const q = fileQueue();
        const types = [undefined, null, 1, '', 'a', [], {}]
        types.forEach(unfile => {
            expect(() => q.enqueue(unfile)).toThrow()
        })
    })
})

describe('fileQueue().isEnqueued()', () => {
    it('should find files is in the queue', () => {
        const file = new Vinyl({ path: 'bar.foo' })
        const q = fileQueue()
        q.enqueue(file)
        expect(q.isEnqueued('*.foo')).toBe(true)
        expect(q.isEnqueued('*.bar')).toBe(false)
    })
})
