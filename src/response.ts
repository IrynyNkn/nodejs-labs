import { ServerResponse } from 'http'
import getContentType from './utils/getContentType.js'

const formatResponse = {
  'application/json': (data: any) => ({
    formattedData: JSON.stringify(data),
    contentType: 'application/json',
  }),
  'text/plain': (data: any) => ({
    formattedData: data,
    contentType: 'text/plain',
  }),
  'text/html': (data: any) => ({
    formattedData: data,
    contentType: 'text/html',
  }),
  'application/x-www-form-urlencoded': (data: any) => ({
    formattedData: JSON.stringify(data),
    contentType: 'application/x-www-form-urlencoded',
  }),
}

function send(
  res: ServerResponse,
  data: any = '',
  type = 'application/json',
  statusCode = 200,
) {
  if (!(type in formatResponse)) {
    res.writeHead(500)
    res.write(`Unsupported response type: ${getContentType(type)}`)
    res.end()
    return
  }

  const { formattedData, contentType } =
    formatResponse[type as keyof typeof formatResponse](data)

  res.setHeader('Content-Type', contentType)
  res.writeHead(statusCode)
  res.write(formattedData)

  res.end()
}

export default send
