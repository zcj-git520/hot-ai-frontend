export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiBaseUrl as string
  const url = `${apiUrl}/articles/categories`
  const res = await fetch(url)
  return await res.json()
})
