import crypto from 'crypto'

import { setUserCookie } from '#svr/auth.js'
import { defineJSONHandler } from '#svr/utils/defineHandler.js'

function md5(str: string) {
  return crypto.createHash('md5').update(str).digest('hex')
}

export default defineJSONHandler<{}, {
  username: string
  password: string
  isRemember?: boolean
  expireDays?: number
}>(async (req, res) => {
  const {
    username, password,
    isRemember = false,
    expireDays = 7
  } = req.body
  let expireTime: number | undefined
  if (expireDays > 0) {
    expireTime = Date.now() + 60 * 60 * 24 * expireDays * 1000
  }
  if (isRemember) {
    expireTime = undefined
  }
  await setUserCookie(res, {
    user: {
      id: `${username}:${md5(password)}`,
      name: username
    }
  }, expireTime)
})
