import { expireUserCookie } from '#svr/auth.js'
import { defineJSONHandler } from '#svr/utils/defineHandler.js'

export default defineJSONHandler((_, res) => expireUserCookie(res))
