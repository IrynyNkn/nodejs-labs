function getContentType(contentType: string) {
  return contentType.split(';')[0]
}

export default getContentType
