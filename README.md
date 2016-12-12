# perioda
Periodical task runner for Node.js with support for callbacks and promises.

## Install
```
npm install perioda --save
```

## Usage
```js
const perioda = require('perioda')

const fn = function (cb) {
  console.log('running task')
  process.nextTick(cb)
}

// or return Promise

const fn = function () {
  return new Promise((resolve, reject) => {
    // do something
    resolve()
  })
}

const task = perioda(fn, 1000).start()

task.on('error', (err) => {
  console.log('processing error: %s', err.message)
  task.stop()
})

task.on('result', (resutl) => {
  console.log('task result: %j', result)
})
```

## Test
```
npm test
```

## Licence
MIT
