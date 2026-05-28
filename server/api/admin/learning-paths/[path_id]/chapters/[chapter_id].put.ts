import http from 'http'

export default defineEventHandler(async (event) => {
  const pathId = getRouterParam(event, 'path_id')
  const chapterId = getRouterParam(event, 'chapter_id')
  const body = await readBody(event)

  const urlString = `http://localhost/api/admin/learning-paths/${pathId}/chapters/${chapterId}`
  const url = new URL(urlString)

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(body))
      }
    }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data))
          } catch {
            resolve(data)
          }
        } else {
          reject(createError({
            statusCode: res.statusCode || 502,
            statusMessage: 'Failed to update chapter: ' + data
          }))
        }
      })
    })
    req.on('error', (e) => {
      reject(createError({
        statusCode: 502,
        statusMessage: 'Failed to update chapter: ' + e.message
      }))
    })
    req.write(JSON.stringify(body))
    req.end()
  })
})