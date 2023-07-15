import { defineRequireAuthHandler } from '#svr/auth.js'
import type { Handler } from '#svr/utils/defineHandler.js'
import defineHandler, { HTTPError } from '#svr/utils/defineHandler.js'

const handlers = {
  GET: (defineHandler as typeof defineRequireAuthHandler)(async req => {
    return '123'
  }),
  POST: (defineHandler as typeof defineRequireAuthHandler)(async req => {
    return '456'
  })
} as Record<string, Handler>

// @url /api/agenda
export default defineRequireAuthHandler(async (req, res) => {
  const handler = handlers[req.method ?? '']
  if (!handler) {
    throw new HTTPError(405, 'Method Not Allowed')
  }

  return handler(req, res)
})
