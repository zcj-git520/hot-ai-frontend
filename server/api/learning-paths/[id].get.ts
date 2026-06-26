export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBaseUrl as string
  const id = getRouterParam(event, 'id')
  const url = `${apiUrl}/learning-paths/${id}`
  const res = await fetch(url)
  return await res.json()
})
