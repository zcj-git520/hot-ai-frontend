import http from 'http'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const urlString = `http://localhost/api/admin/articles/${id}/reject`
  const url = new URL(urlString)

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
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
            statusMessage: 'Failed to reject article: ' + data
          }))
        }
      })
    })
    req.on('error', (e) => {
      reject(createError({
        statusCode: 502,
        statusMessage: 'Failed to reject article: ' + e.message
      }))
    })
    req.write(JSON.stringify(body))
    req.end()
  })
})
