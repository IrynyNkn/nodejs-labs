import Router from '../Router'

const router = new Router('/api')

router.get('/test', (req, res) => {
  res.send({ message: 'i am a test route :)' })
})

router.post('/test', (req, res, payload) => {
  res.send(payload)
})

router.get('/test/me', (req, res) => {
  res.send({ message: 'i am a nested test route, thank you for testing me' })
})

export default router
