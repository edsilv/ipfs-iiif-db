'use strict'

const start = require('./start')
const Producer = require('./producer')
const Consumer = require('./consumer')

module.exports = () => {
  let ipfs, producer, consumer

  return {
    start: _start,
    stop: _stop,
    put: _put,
    get: _get,
    onChange: _onChange,
    id: _id
  }

  function _start (callback) {
    if (ipfs) {
      callback(new Error('IPFS already started'))
      return // early
    }

    ipfs = start((err) => {
      if (err) {
        callback(err)
        return // early
      }

      producer = Producer(ipfs)
      consumer = Consumer(ipfs)
      callback()
    })

    return ipfs
  }

  function _id (callback) {
    if (!ipfs) {
      callback(new Error('IPFS not started'))
      return // early
    }
    return ipfs.id((err, reply) => {
      if (err) {
        callback(err)
      } else {
        callback(null, reply.id)
      }
    })
  }

  function _stop (callback) {
    if (!ipfs) {
      callback(new Error('IPFS stopped'))
      return // early
    }

    const _ipfs = ipfs
    ipfs = null
    _ipfs.once('stop', () => callback())
    _ipfs.stop()
  }

  function _put (id, value, callback) {
    if (!ipfs) {
      callback(new Error('IPFS stopped'))
      return // early
    }
    return producer.put(id, value, callback)
  }

  function _get (id, callback) {
    if (!ipfs) {
      callback(new Error('IPFS stopped'))
      return // early
    }
    return consumer.get(id, callback)
  }

  function _onChange (id, fn) {
    if (!ipfs) {
      throw new Error('IPFS stopped')
    }
    return consumer.onChange(id, fn)
  }
}
