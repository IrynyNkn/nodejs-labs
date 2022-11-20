import { ServerResponse } from 'http'
import send from './response.js'

function defaultHandler(res: ServerResponse) {
  send(res, 'Not found', 'application/json', 404)
}

export default defaultHandler
