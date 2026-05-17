export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // Forward to backend admin-svc
  const url = `http://localhost:8006/admin/learning-paths?page=${query.page || 1}&page_size=${query.page_size || 20}`

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