import Server from './Server.js'
import router from './routes/index.js'
import { PORT } from './utils/consts.js'

const server = new Server()

server.use(router).listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

process.on('SIGINT', async () => {
  await server.shutdown()
})
