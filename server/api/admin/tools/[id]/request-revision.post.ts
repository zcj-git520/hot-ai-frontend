export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  // Forward to backend admin-svc
  const url = `http://localhost/api/admin/tools/${id}/request-revision`

  try {
    const data = await $fetch(url, {
      method: 'POST',
      headers: {
        ...getHeaders(event),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    return data
  } catch (err: any) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch from admin-svc: ' + err.message
    })
  }
})