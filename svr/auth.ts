// Copy from https://github.com/vercel/examples/blob/aadce63d7693e4a2a56c08294f145b40338f033b/edge-middleware/jwt-authentication/lib/auth.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { VercelRequestQuery } from '@vercel/node'
import { jwtVerify, SignJWT } from 'jose'
import { nanoid } from 'nanoid'

import { getJwtSecretKey, USER_TOKEN } from './constants.js'
import type { JSONRespHandler } from './utils/defineHandler.js'
import { defineJSONHandler, HTTPError } from './utils/defineHandler.js'

interface UserJwtPayload {
  jti: string
  iat: number
  user: {
    id: string
    name: string
  }
}

export class AuthError extends HTTPError {
  constructor(message: string) { super(401, message) }
}

/**
 * Verifies the user's JWT token and returns its payload if it's valid.
 */
export async function verifyAuth(req: VercelRequest) {
  const userTokenCookie = req.cookies[USER_TOKEN]?.toString() ?? ''
  if (!userTokenCookie) throw new AuthError('Missing user token')

  const token = userTokenCookie
    .replace(`${USER_TOKEN}=`, '')
    .split(';')[0]

  if (!token) throw new AuthError('Missing user token')

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    )
    const { jti: _, iat: __, ...payload } = verified.payload

    return payload as unknown as UserJwtPayload
  } catch (err) {
    throw new AuthError('Your token has expired.')
  }
}

/**
 * Adds the user token cookie to a response.
 */
export async function setUserCookie(
  res: VercelResponse,
  pay?: Omit<UserJwtPayload, 'iat' | 'jti'>,
  // 1 week
  expires = Date.now() + 60 * 60 * 24 * 7 * 1000
) {
  const signJWT = new SignJWT(pay ?? {})
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(nanoid())
    .setIssuedAt()
  if (expires) signJWT.setExpirationTime(expires)

  const token = await signJWT.sign(new TextEncoder().encode(getJwtSecretKey()))

  let cookie = `${USER_TOKEN}=${token}; Path=/; HttpOnly; SameSite=Strict`
  if (expires) cookie += `; Max-Age=${expires}`
  res.setHeader('Set-Cookie', cookie)
}

/**
 * Expires the user token cookie
 */
export function expireUserCookie(res: VercelResponse) {
  res.setHeader('Set-Cookie', `${USER_TOKEN}=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict`)
}

export function defineRequireAuthHandler<
  Q extends VercelRequestQuery,
  B = unknown,
  T = unknown,
  E extends
    { user: Awaited<ReturnType<typeof verifyAuth>> } =
    { user: Awaited<ReturnType<typeof verifyAuth>> }
>(handler: JSONRespHandler<Q, B, T, E>) {
  return defineJSONHandler<Q, B, T, E>(async (req, res) => {
    if (!req.extra) req.extra = {} as E
    req.extra.user = await verifyAuth(req)
    return handler(req, res)
  })
}
