// import { useCustomerStore } from '~/stores/customer'
import { sendError } from 'h3'
import crypto from 'crypto-js'
export default defineEventHandler(async (event) => {
  const headers = event.req.headers
  const config = useRuntimeConfig()
  const { email } = await readBody(event)
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
  const decrypt = (ciphertext, key) => {
    return crypto.AES.decrypt(ciphertext, key).toString(crypto.enc.Utf8)
  }
  const formateData = (items) => {
    const newItems = items.map((c) => {
      if (!c.email) {
        const newItem = {
          company_name: c.company_name,
          email: ''
        }
        return newItem
      } else if (!c.company_name) {
        const newItem = {
          company_name: '無',
          email: c.email
        }
        return newItem
      } else {
        return {
          company_name: c.company_name.toString(),
          email: c.email.toString()
        }
      }
    })
    return newItems
  }
  const searchCustomer = (email) => {
    const itemsData = customerList
    const key = config.cryptoSecret
    const customers = JSON.parse(decrypt(itemsData, key))
    const result = formateData(customers).find((c) => {
      return c.email.includes(email)
    })
    const emptyResult = {
      company_name: '',
      email: '',
    }
    return result === undefined ? emptyResult : result
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


