import { defineJSONHandler } from '#svr/utils/defineHandler.js'
import { getRedis } from '#svr/utils/getRedis.js'

const redis = getRedis()

export default defineJSONHandler<{ isReset: string }>(async ({ query }) => {
  const isReset = ['true', '1', ''].includes(query.isReset)

  if (isReset) {
    await redis.set('counter', '0')
    return { c: 0 }
  }
  return { c: await redis.incr('counter') }
})
