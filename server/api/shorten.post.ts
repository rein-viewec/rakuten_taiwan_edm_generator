import { sendError } from 'h3'
export default defineEventHandler(async (event) => {
  const headers = event.req.headers
  const config = useRuntimeConfig()
  const { url } = await readBody(event)
  if (headers.authorization !== `Bearer ${config.secret_token}`) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Access denied!'
    }))
  }
  if (!url) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Invalid parameter'
    }))
  }
  const createShortenLink = async () => {
    try {
      const endPoint = config.reurl_api_url
      const payload = { url }
      const urlPath = `${endPoint}/shorten`
      const res = await $fetch(urlPath, {
        method: 'POST',
        headers: {
          'reurl-api-key': config.reurl_secret_key,
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: payload
      })
      return res
    } catch (error) {
      return sendError(event, createError({
        statusCode: 400,
        statusMessage: 'Invalid url, please check'
      }))
    }
  }
  const res = await createShortenLink()
  return {
    statusCode: 200,
    statusMessage: 'OK',
    result: res
  }
})


