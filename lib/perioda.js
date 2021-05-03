'use strict'

// Module dependencies.
const parseDuration = require('parse-duration')
const EventEmitter = require('events').EventEmitter

class Task extends EventEmitter {
  constructor (fn, interval) {
    super()
    if (typeof fn !== 'function') {
      throw new Error('`fn` must be function')
    }
    this.fn = fn
    this.interval = parseDuration(interval) || 1000
    this.running = false
    this.timer = null

    this.done = (err, result) => {
      if (err) this.emit('error', err)
      else this.emit('result', result)
      this.timer = this.running && setTimeout(this.run, this.interval).unref()
    }
    this.run = () => {
      this.emit('run')
      let promise = this.fn(this.done)
      if (promise && typeof promise.then === 'function') {
        promise.then(() => this.done(), this.done)
      }
    }
  }

  start () {
    this.running = true
    this.run()
    return this
  }

  stop () {
    clearTimeout(this.timer)
    this.timer = null
    this.running = false
    return this
  }

  running () {
    return this.running
  }
}

function task (fn, interval) {
  return new Task(fn, interval)
}

module.exports = task
module.exports.Task = Task
