export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const url = 'http://localhost:8006/admin/learning-paths'

  try {
    const data = await $fetch(url, {
      method: 'POST',
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
      statusMessage: 'Failed to create: ' + err.message
    })
  }
})