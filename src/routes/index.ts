import Router from '../Router.js'
import send from '../response.js'

const router = new Router()

router.get('/', (req, res) => {
  send(res, { message: 'i am a root route :)' }, 'application/json')
})

router.get('/test', (req, res) => {
  send(res, { message: 'i am a test route :)' }, 'application/json')
})

router.post('/test', (req, res, payload) => {
  const contentType = req.headers['content-type']
  send(res, payload, contentType)
})

export default router
