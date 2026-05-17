export default defineEventHandler(async (event) => {
  const pathId = getRouterParam(event, 'path_id')

  const url = `http://localhost:8006/admin/learning-paths/${pathId}`

  try {
    const data = await $fetch(url, {
      method: 'DELETE',
      headers: getHeaders(event)
    })
    return data
  } catch (err: any) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to delete learning path: ' + err.message
    })
  }
})