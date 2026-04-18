export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBaseUrl as string
  const slug = getRouterParam(event, 'slug')
  const url = `${apiUrl}/tools/${slug}`
  const res = await fetch(url)
  return await res.json()
})
