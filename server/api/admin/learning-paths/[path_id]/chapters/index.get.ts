export default defineEventHandler(async (event) => {
  const pathId = getRouterParam(event, 'path_id')

  const url = `http://localhost:8006/admin/learning-paths/${pathId}/chapters`

  try {
    const data = await $fetch(url, {
      headers: getHeaders(event)
    })
    return data
  } catch (err: any) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to fetch chapters: ' + err.message
    })
  }
})