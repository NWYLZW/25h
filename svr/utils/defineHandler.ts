import type { VercelRequest, VercelRequestQuery, VercelResponse } from '@vercel/node'

export interface Handler {
  (req: VercelRequest, res: VercelResponse): any | Promise<any>
}

export default function defineHandler(handler: Handler) {
  return handler
}

export interface JSONRespHandler<
  Q extends VercelRequestQuery,
  B,
  T,
  E
> {
  (
    req:
      & Omit<VercelRequest, 'query' | 'body'>
      & { query: Q }
      & { body: B }
      & { extra: E },
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
  T = unknown,
  E = unknown
>(handler: JSONRespHandler<Q, B, T, E>) {
  return defineHandler(async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    try {
      const resp = await handler(
        // @ts-ignore
        req,
        res
      )
      if (resp === undefined) {
        res.statusCode = 204
      } else {
        res.statusCode = 200
      }
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
