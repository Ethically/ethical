const createQueue = require('../../index.js')

describe('queue()', () => {
    it('should insert item into the queue', () => {
        const queue = createQueue()
        expect(queue.queue).toEqual([])
    })
    it('should be extendable', () => {
        function Extendable () {
            createQueue(this)
            this.extended = () => true
        }
        const queue = new Extendable()
        expect(queue.queue).toEqual([])
        expect(queue.extended()).toBe(true)
    })
})

describe('queue().enqueue()', () => {
    it('should insert item into the queue', () => {
        const queue = createQueue()
        queue.enqueue(1)
        expect(queue.queue.length).toBe(1)
        expect(queue.queue[0]).toBe(1)
    })
})

describe('queue().enqueue()', () => {
    it('should return undefined', () => {
        const queue = createQueue()
        expect(queue.dequeue()).toBeUndefined()
    })
    it('should remove item from the queue', () => {
        const queue = createQueue()
        queue.enqueue(1)
        const item = queue.dequeue()
        expect(item).toBe(1)
    })
    it('should remove first inserted item from the queue', () => {
        const queue = createQueue()
        queue.enqueue(1)
        queue.enqueue(2)
        queue.enqueue(3)
        const item = queue.dequeue()
        expect(item).toBe(1)
    })
})

describe('queue().isEmpty()', () => {
    it('should return true', () => {
        const queue = createQueue()
        expect(queue.isEmpty()).toBe(true)
    })

    it('should return false', () => {
        const queue = createQueue()
        queue.enqueue(1)
        expect(queue.isEmpty()).toBe(false)
    })
})

describe('queue().peek()', () => {
    it('should return the top item', () => {
        const queue = createQueue()
        queue.enqueue(1)
        queue.enqueue(2)
        queue.enqueue(3)
        expect(queue.peek()).toBe(1)
        expect(queue.queue.length).toBe(3)
        expect(queue.queue[0]).toBe(1)
    })
})

describe('queue().length', () => {
    it('should return the number of items in the queue', () => {
        const queue = createQueue()
        queue.enqueue(1)
        queue.enqueue(2)
        queue.enqueue(3)
        expect(queue.length()).toBe(3)
    })
})
