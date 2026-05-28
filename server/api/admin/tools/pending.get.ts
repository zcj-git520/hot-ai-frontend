export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // Build query params
  const params = new URLSearchParams({
    page: String(query.page || 1),
    page_size: String(query.page_size || 20)
  })
  if (query.search) params.append('search', String(query.search))
  if (query.review_status) params.append('review_status', String(query.review_status))

  // Forward to backend admin-svc
  const url = `http://localhost/api/admin/tools/pending?${params.toString()}`

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