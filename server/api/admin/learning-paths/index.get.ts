export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // Build query params including filters
  const params = new URLSearchParams({
    page: String(query.page || 1),
    page_size: String(query.page_size || 20)
  })
  if (query.keyword) params.append('search', String(query.keyword))
  if (query.difficulty) params.append('difficulty', String(query.difficulty))
  if (query.status) params.append('status', String(query.status))

  // Forward to backend admin-svc
  const url = `http://localhost:8006/admin/learning-paths?${params.toString()}`

  try {
    const data = await $fetch(url, {
      headers: getHeaders(event)
    })
    return data
  } catch (err: any) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch from admin-svc: ' + err.message
    })
  }
})