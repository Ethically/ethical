/*
    Queue.js

    A function to represent a queue.
    A queue is a first-in-first-out (FIFO) data structure -
    items are added to the end of the queue and removed from the front.

    Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
    the terms of the CC0 1.0 Universal legal code:
    http://creativecommons.org/publicdomain/zero/1.0/legalcode

    Readapted by Marcelino Braulio - http://marceli.no
*/

function Queue() {

    this.queue = []
    this.offset = 0

    this.length = () => ( this.queue.length - this.offset )
    this.isEmpty = () => ( this.queue.length === 0 )
    this.peek = () => ( this.queue[this.offset] )
    this.enqueue = (item) => ( this.queue.push(item) )
    this.dequeue = () => {
        if (this.queue.length === 0) return undefined

        const item = this.queue[this.offset]
        if (++this.offset * 2 >= this.queue.length) {
            this.queue = this.queue.slice(this.offset)
            this.offset = 0
        }
        return item
    }
}

module.exports = (extend) => {
    if (extend) {
        return Queue.call(extend)
    }
    return new Queue()
}
