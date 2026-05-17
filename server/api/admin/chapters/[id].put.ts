export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const url = `http://localhost:8006/admin/chapters/${id}`

  try {
    const data = await $fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders(event)
      },
      body: JSON.stringify(body)
    })
    return data
  } catch (err: any) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to update chapter: ' + err.message
    })
  }
})