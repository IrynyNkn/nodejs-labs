import { IncomingMessage, ServerResponse } from 'http'
import { URL } from 'url'
import defaultHandler from './defaultHandler.js'
import convertToJson from './utils/convertToJson.js'
import getContentType from './utils/getContentType.js'
import { HTTP_METHODS } from './utils/consts.js'

type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
  payload: any,
) => void | Promise<void>

const processedContentTypes: { [key: string]: (val: string) => any } = {
  'text/html': (text: string) => text,
  'text/plain': (text: string) => text,
  'application/json': (json: string) => convertToJson(json),
  'application/x-www-form-urlencoded': (data: string) => {
    return Object.fromEntries(new URLSearchParams(data))
  },
}

class Router {
  private handlers: { [path: string]: { [method: string]: Handler[] } } = {}

  add(method: HTTP_METHODS, path = '/', ...handlers: Handler[]) {
    if (handlers.length === 0)
      throw new Error(
        `The handler for method ${method} and path ${path} doesn't exist`,
      )

    if (!this.handlers[path]?.[method])
      this.handlers[path] = {
        ...(this.handlers[path] || {}),
        [method]: [...handlers],
      }
    else this.handlers[path][method].push(...handlers)
  }

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const url = new URL(req.url || '/', `http://${req.headers.host}`)
    const urlPath = url.pathname

    const method = req.method || HTTP_METHODS.GET

    const routeHandlers = this.handlers[urlPath]?.[method]

    if (!routeHandlers || routeHandlers.length === 0) {
      defaultHandler(res)
      return
    }

    let payload = {}
    let rawRequestStr = ''
    for await (const chunk of req) {
      rawRequestStr += chunk
    }

    const contentTypeHeader = req.headers['content-type']

    if (contentTypeHeader) {
      const contentType: string = getContentType(contentTypeHeader)
      if (processedContentTypes[contentType]) {
        payload = processedContentTypes[contentType](rawRequestStr)
      }
    }

    for (const handler of this.handlers[urlPath][method]) {
      try {
        await handler(req, res, payload)
      } catch (e) {
        res.statusCode = 500
        res.end(
          process.env.NODE_ENV === 'production' ? 'Internal Server Error' : e,
        )
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
