import type { VercelRequest, VercelRequestQuery, VercelResponse } from '@vercel/node'

interface Handler {
  (req: VercelRequest, res: VercelResponse): void | Promise<void>
}

export default function _defineHandler(handler: Handler) {
  return handler
}

interface JSONRespHandler<
  Q extends VercelRequestQuery,
  B,
  T
> {
  (
    req:
      & VercelRequest
      & { query: Q }
      & { Body: B },
    res: VercelResponse
  ): T | Promise<T>
}

export class HTTPError extends Error {
  constructor(public statusCode: number, message?: string) {
    super(message)
  }
}

export function defineJSONHandler<
  Q extends VercelRequestQuery = VercelRequestQuery,
  B = unknown,
  T = unknown
>(handler: JSONRespHandler<Q, B, T>) {
  return _defineHandler(async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    try {
      // @ts-ignore
      const resp = await handler(req, res)
      res.statusCode = 200
      res.json(resp)
    } catch (e) {
      console.error(e)
      if (e instanceof HTTPError) {
        res.statusCode = e.statusCode
        res.json({ error: e.message })
      } else {
        res.statusCode = 500
        res.json({ error: 'Internal Server Error' })
      }
    }
  })
}
