import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.json({ name: 'John Doe' })
}
