import http from 'http'
import zlib from 'zlib'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const params = new URLSearchParams({
    page: String(query.page || 1),
    page_size: String(query.page_size || 12)
  })
  if (query.search) params.append('search', String(query.search))
  if (query.review_status) params.append('review_status', String(query.review_status))

  const urlString = `http://localhost/api/admin/articles/pending?${params.toString()}`
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
          const contentEncoding = res.headers['content-encoding']
          const data = Buffer.concat(chunks)

          if (contentEncoding === 'gzip') {
            zlib.gunzip(data, (err, decoded) => {
              if (err) {
                try {
                  resolve(JSON.parse(data.toString()))
                } catch {
                  resolve(data.toString())
                }
              } else {
                try {
                  resolve(JSON.parse(decoded.toString()))
                } catch {
                  resolve(decoded.toString())
                }
              }
            })
          } else if (contentEncoding === 'deflate') {
            zlib.inflate(data, (err, decoded) => {
              if (err) {
                try {
                  resolve(JSON.parse(data.toString()))
                } catch {
                  resolve(data.toString())
                }
              } else {
                try {
                  resolve(JSON.parse(decoded.toString()))
                } catch {
                  resolve(decoded.toString())
                }
              }
            })
          } else {
            try {
              resolve(JSON.parse(data.toString()))
            } catch {
              resolve(data.toString())
            }
          }
        } else {
          const data = Buffer.concat(chunks).toString()
          reject(createError({
            statusCode: res.statusCode || 502,
            statusMessage: 'Failed to fetch articles: ' + data
          }))
        }
      })
    }).on('error', (e) => {
      reject(createError({
        statusCode: 502,
        statusMessage: 'Failed to fetch articles: ' + e.message
      }))
    })
    req.end()
  })
})