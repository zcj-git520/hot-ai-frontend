export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  // Forward to backend admin-svc
  const url = `http://localhost/api/admin/tools/${id}/approve`

  try {
    const data = await $fetch(url, {
      method: 'POST',
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