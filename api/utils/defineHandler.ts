import type { VercelRequest, VercelResponse } from '@vercel/node'

interface Handler {
  (req: VercelRequest, res: VercelResponse): void | Promise<void>
}

export default function defineHandler(handler: Handler) {
  return handler
}

interface JSONRespHandler<T> {
  (req: VercelRequest, res: VercelResponse): T | Promise<T>
}

export class HTTPError extends Error {
  constructor(public statusCode: number, message?: string) {
    super(message)
  }
}

export function defineJSONHandler<T>(handler: JSONRespHandler<T>) {
  return defineHandler(async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    try {
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