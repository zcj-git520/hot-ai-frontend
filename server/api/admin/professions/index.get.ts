import http from 'http'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const params = new URLSearchParams({
    page: String(query.page || 1),
    page_size: String(query.page_size || 12)
  })
  if (query.search) params.append('search', String(query.search))
  if (query.risk_level) params.append('risk_level', String(query.risk_level))

  const urlString = `http://localhost/api/admin/professions?${params.toString()}`
  const url = new URL(urlString)

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: url.hostname,
      port: 80,
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'Accept-Encoding': 'identity',
        'Cache-Control': 'no-cache'
      }
    }, (res) => {
      const chunks: Buffer[] = []
      res.on('data', (chunk: Buffer) => chunks.push(chunk))
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
            statusMessage: 'Failed to fetch professions: ' + data
          }))
        }
      })
    }).on('error', (e) => {
      reject(createError({
        statusCode: 502,
        statusMessage: 'Failed to fetch professions: ' + e.message
      }))
    })
    req.end()
  })
})