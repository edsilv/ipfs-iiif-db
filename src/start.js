'use strict'

const IPFS = require('ipfs')

module.exports = function start (store, _callback) {
  const options = {
    repo: repoPath(),
    config: {
      Addresses: {
        Swarm: [
          '/libp2p-webrtc-star/dns4/star-signal.cloud.ipfs.team/wss'
        ]
      }
    },
    EXPERIMENTAL: {
      pubsub: true
    }
  }


  const ipfs = new IPFS(options)

  console.log('IPFS:', ipfs)

  ipfs.on('error', callback)
  ipfs.on('ready', onReady)

  return ipfs

  function callback (err) {
    ipfs.removeListener('error', callback)
    ipfs.removeListener('ready', onReady)
    _callback(err)
  }

  function onReady () {
    console.log('IPFS ready')
    store.start(callback)
  }
}

function repoPath () {
  return 'temp/ipfs-iifs-producer-' + Math.random()
}
