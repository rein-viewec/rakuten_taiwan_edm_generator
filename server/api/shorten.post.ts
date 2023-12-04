// import { useCustomerStore } from '~/stores/customer'
import { sendError } from 'h3'
import crypto from 'crypto-js'
export default defineEventHandler(async (event) => {
  const headers = event.req.headers
  const config = useRuntimeConfig()
  const { email } = await readBody(event)
  // createShortenLink: async () => {
  //   try {
  //     const query = {
  //       'Content-Type': 'application/json',
  //     }
  //     const endPoint = 'https://api.reurl.cc/shorten'
  //     const payload = combineUrl.value
  //     console.warn('combineUrl', payload)
  //     const searchParams = new URLSearchParams(query)
  //     const urlPath = `${endPoint}/${searchParams}`
  //     const res = await $fetch(urlPath, {
  //       method: 'POST',
  //       query,
  //       headers: {
  //         Authorization: '',
  //         'reurl-api-key': config.reurl_key,
  //         'Content-Type': 'application/json;charset=utf-8',
  //       },
  //     })
  //     return res
  //   } catch (error) {
  //     console.warn(error)
  //   }
  // },
  if (headers.authorization !== `Bearer ${config.public.token}`) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Access denied!'
    }))
  }
  if (!email) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Invalid parameter'
    }))
  }
  const data = await new Promise((resolve) => setTimeout(
    () => resolve(searchCustomer(email)),
    Math.floor((Math.random() * 2000) + 1000)
  ))
  return {
    statusCode: 200,
    statusMessage: 'OK',
    result: data
  }
})


