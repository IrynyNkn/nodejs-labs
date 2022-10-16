import type { VercelRequest, VercelResponse } from '@vercel/node'

const msg = 'Hello world ;)'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).send({ msg })
}
