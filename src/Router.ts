import { HTTP_METHODS } from './utils/consts'
import { VercelRequest, VercelResponse } from '@vercel/node'

type Handler = (
  req: VercelRequest,
  res: VercelResponse,
  payload: any,
) => void | Promise<void>

class Router {
  private handlers: { [path: string]: { [method: string]: Handler[] } } = {}
  private readonly basePath: string

  constructor(path: string) {
    this.basePath = path
  }

  add(method: HTTP_METHODS, path = '/', ...handlers: Handler[]) {
    const composedPath = this.basePath + path

    if (handlers.length === 0)
      throw new Error(
        `The handler for method ${method} and path ${composedPath} doesn't exist`,
      )

    if (!this.handlers[composedPath]?.[method])
      this.handlers[composedPath] = {
        ...(this.handlers[composedPath] || {}),
        [method]: [...handlers],
      }
    else this.handlers[composedPath][method].push(...handlers)
  }

  async handle(req: VercelRequest, res: VercelResponse): Promise<void> {
    const urlPath = req.url
    const method = req.method || HTTP_METHODS.GET

    const routeHandlers = this.handlers[urlPath as string]?.[method]

    if (!routeHandlers || routeHandlers.length === 0) {
      res.status(404).send('Not found')
      return
    }

    const payload = req.body || {}

    for (const handler of this.handlers[urlPath as string][method]) {
      try {
        await handler(req, res, payload)
      } catch {
        res.status(500).send('Internal Server Error')
      }
    }
  }

  get(path = '/', ...handlers: Handler[]) {
    this.add(HTTP_METHODS.GET, path, ...handlers)
  }

  post(path = '/', ...handlers: Handler[]) {
    this.add(HTTP_METHODS.POST, path, ...handlers)
  }

  put(path = '/', ...handlers: Handler[]) {
    this.add(HTTP_METHODS.PUT, path, ...handlers)
  }

  patch(path = '/', ...handlers: Handler[]) {
    this.add(HTTP_METHODS.PATCH, path, ...handlers)
  }

  delete(path = '/', ...handlers: Handler[]) {
    this.add(HTTP_METHODS.DELETE, path, ...handlers)
  }

  options(path = '/', ...handlers: Handler[]) {
    this.add(HTTP_METHODS.OPTIONS, path, ...handlers)
  }

  trace(path = '/', ...handlers: Handler[]) {
    this.add(HTTP_METHODS.TRACE, path, ...handlers)
  }

  head(path = '/', ...handlers: Handler[]) {
    this.add(HTTP_METHODS.HEAD, path, ...handlers)
  }

  connect(path = '/', ...handlers: Handler[]) {
    this.add(HTTP_METHODS.CONNECT, path, ...handlers)
  }
}

export default Router
