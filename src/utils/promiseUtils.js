export class OperationTimeoutError extends Error {
  constructor(message = '操作超时') {
    super(message)
    this.name = 'OperationTimeoutError'
    this.code = 'OPERATION_TIMEOUT'
  }
}

export function withTimeout(promise, timeoutMs, message) {
  let timeoutId
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new OperationTimeoutError(message))
    }, timeoutMs)
  })

  return Promise.race([promise, timeoutPromise])
    .finally(() => clearTimeout(timeoutId))
}

export async function retryAsync(
  operation,
  { attempts = 2, delayMs = 0, shouldRetry = () => true } = {},
) {
  let lastError

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      if (attempt >= attempts || !shouldRetry(error, attempt)) {
        throw error
      }
      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  }

  throw lastError
}
