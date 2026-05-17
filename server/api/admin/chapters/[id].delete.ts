export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const url = `http://localhost:8006/admin/chapters/${id}`

  try {
    const data = await $fetch(url, {
      method: 'DELETE',
      headers: getHeaders(event)
    })
    return data
  } catch (err: any) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to delete chapter: ' + err.message
    })
  }
})