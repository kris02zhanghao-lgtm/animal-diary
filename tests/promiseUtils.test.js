import test from 'node:test'
import assert from 'node:assert/strict'
import { retryAsync, withTimeout } from '../src/utils/promiseUtils.js'

test('withTimeout returns a resolved value before the deadline', async () => {
  const result = await withTimeout(Promise.resolve('ready'), 50)
  assert.equal(result, 'ready')
})

test('withTimeout rejects a pending operation with a timeout error', async () => {
  await assert.rejects(
    withTimeout(new Promise(() => {}), 10, 'session timeout'),
    error => error.code === 'OPERATION_TIMEOUT' && error.message === 'session timeout',
  )
})

test('retryAsync retries a failed operation and returns the next success', async () => {
  let calls = 0
  const result = await retryAsync(() => {
    calls += 1
    if (calls === 1) return Promise.reject(new Error('temporary failure'))
    return Promise.resolve('connected')
  }, { attempts: 2 })

  assert.equal(result, 'connected')
  assert.equal(calls, 2)
})

test('retryAsync throws the final error after all attempts fail', async () => {
  let calls = 0
  await assert.rejects(
    retryAsync(() => {
      calls += 1
      return Promise.reject(new Error(`failure ${calls}`))
    }, { attempts: 2 }),
    /failure 2/,
  )
  assert.equal(calls, 2)
})

test('retryAsync stops when shouldRetry rejects the error', async () => {
  let calls = 0
  await assert.rejects(
    retryAsync(() => {
      calls += 1
      return Promise.reject(new Error('do not retry'))
    }, {
      attempts: 2,
      shouldRetry: () => false,
    }),
    /do not retry/,
  )
  assert.equal(calls, 1)
})
