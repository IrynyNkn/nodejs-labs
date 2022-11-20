import Router from '../Router'

const router = new Router('/api')

router.get('/', (req, res) => {
  res.send({ message: 'i am a root route :)' })
})

router.get('/test', (req, res) => {
  res.send({ message: 'i am a test route :)' })
})

router.post('/test', (req, res, payload) => {
  res.send(payload)
})

export default router
