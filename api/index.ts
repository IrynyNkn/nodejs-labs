import { VercelRequest, VercelResponse } from '@vercel/node'
import router from '../src/routes'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await router.handle(req, res)
  } catch (e) {
    const errorMsg = (e as Error).message
    res
      .status(500)
      .send('Failure occurred while processing request!' + errorMsg)
  }
}
