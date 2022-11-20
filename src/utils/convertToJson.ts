function convertToJson(data: string, fallback: any = {}) {
  try {
    return JSON.parse(data)
  } catch {
    return fallback
  }
}

export default convertToJson
