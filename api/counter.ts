import { Redis } from '@upstash/redis'

import { defineJSONHandler } from './utils/_defineHandler.js'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string
})

export default defineJSONHandler<{ isReset: string }>(async ({ query }) => {
  const isReset = ['true', '1', ''].includes(query.isReset)

  if (isReset) {
    await redis.set('counter', '0')
    return { c: 0 }
  }
  return { c: await redis.incr('counter') }
})
