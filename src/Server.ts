import * as http from 'http'
import { Server as HttpServer } from 'http'
import Router from './Router.js'

class Server {
  private httpServer: HttpServer
  private router?: Router

  constructor() {
    this.httpServer = http.createServer()
  }

  use(router: Router): this {
    this.router = router
    return this
  }

  listen(...params: Parameters<HttpServer['listen']>): void {
    if (!this.router) throw new Error('No router used by server')
    this.httpServer = this.httpServer || http.createServer()
    this.httpServer.on('request', this.router.handle.bind(this.router))
    this.httpServer.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
    })
    this.httpServer.listen(...params)
  }

  async shutdown() {
    this.httpServer.close((err) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
    })
  }
}

export default Server
