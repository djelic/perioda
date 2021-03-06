'use strict'
/* eslint-env mocha */

// Module dependencies.
const perioda = require('..')
const sinon = require('sinon')
const assert = require('assert')

describe('perioda', () => {
  describe('instance', () => {
    it('should be able to create task instance', () => {
      let fn = sinon.spy()
      let task = perioda(fn)
      assert(!fn.called)
      assert(task.interval)
    })

    it('should be able to create task instance with custom interval', () => {
      let fn = sinon.spy()
      assert(perioda(fn, 2000).interval, 2000)
      assert(perioda(fn, 60 * 1000).interval, 60 * 1000)
    })

    it('should be able to create task instance with inteval as string', () => {
      let fn = sinon.spy()
      assert(perioda(fn, '50ms').interval, 50)
      assert(perioda(fn, '1s').interval, 1000)
      assert(perioda(fn, '1m').interval, 60 * 1000)
      assert(perioda(fn, '5 m').interval, 5 * 60 * 100)
    })

    it('should not be able to create task instance function not provided', () => {
      assert.throws(() => {
        let task = perioda()
      }, /`fn` must be function/)
    })
  })

  describe('#start()', () => {
    it('should run function periodically', (done) => {
      let fn = sinon.spy((cb) => process.nextTick(cb))
      let task = perioda(fn, 50)

      assert(!fn.called)
      task.start()
      assert(fn.calledOnce)
      setTimeout(() => {
        assert(fn.calledOnce)
        setTimeout(() => {
          assert(fn.calledTwice)
          setTimeout(() => {
            assert(fn.calledThrice)
            done()
          }, 50)
        }, 30)
      }, 25)
    })

    it('should be able to stop task', (done) => {
      let fn = sinon.spy((cb) => process.nextTick(cb))
      let task = perioda(fn, 50)
      task.start()

      assert(fn.calledOnce)
      setTimeout(() => {
        assert(fn.calledTwice)
        task.stop()
        setTimeout(() => {
          assert(fn.calledTwice)
          done()
        }, 70)
      }, 55)
    })

    it('should emit error event if task function returns error', (done) => {
      let err = new Error('foo')
      let onError = sinon.spy()
      let fn = sinon.spy((cb) => process.nextTick(() => cb(err)))
      let task = perioda(fn, 50)
      task.on('error', onError)
      task.start()

      setTimeout(() => {
        assert(onError.calledWith(err))
        done()
      }, 10)
    })

    it('should support function returning promises', (done) => {
      let fn = sinon.spy(() => Promise.resolve())
      let task = perioda(fn, 50)

      assert(!fn.called)
      task.start()
      assert(fn.calledOnce)
      setTimeout(() => {
        assert(fn.calledOnce)
        setTimeout(() => {
          assert(fn.calledTwice)
          setTimeout(() => {
            assert(fn.calledThrice)
            done()
          }, 50)
        }, 30)
      }, 25)
    })
  })
})
