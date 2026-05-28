import http from 'http'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  const urlString = `http://localhost/api/admin/professions/${id}`
  const url = new URL(urlString)

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: url.hostname,
      port: 80,
      path: url.pathname,
      method: 'DELETE',
      headers: {
        'Accept-Encoding': 'identity',
        'Cache-Control': 'no-cache'
      }
    }, (res) => {
      const chunks: Buffer[] = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          const data = Buffer.concat(chunks)
          try {
            resolve(JSON.parse(data.toString()))
          } catch {
            resolve(data.toString())
          }
        } else {
          const data = Buffer.concat(chunks).toString()
          reject(createError({
            statusCode: res.statusCode || 502,
            statusMessage: 'Failed to delete profession: ' + data
          }))
        }
      })
    }).on('error', (e) => {
      reject(createError({
        statusCode: 502,
        statusMessage: 'Failed to delete profession: ' + e.message
      }))
    })
    req.end()
  })
})