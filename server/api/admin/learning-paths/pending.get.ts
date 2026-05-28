export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const params = new URLSearchParams({
    page: String(query.page || 1),
    page_size: String(query.page_size || 20)
  })
  if (query.search) params.append('search', String(query.search))

  const url = `http://localhost/api/admin/learning-paths?${params.toString()}&status=0`

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