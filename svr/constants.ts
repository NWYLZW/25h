// Copy from https://github.com/vercel/examples/blob/aadce63d7693e4a2a56c08294f145b40338f033b/edge-middleware/jwt-authentication/lib/constants.ts
export const USER_TOKEN = '25h-token'

const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY!

export function getJwtSecretKey(): string {
  if (!JWT_SECRET_KEY || JWT_SECRET_KEY.length === 0) {
    throw new Error('The environment variable JWT_SECRET_KEY is not set.')
  }

  return JWT_SECRET_KEY
}
