import axios from 'axios'
const headers = {
  'Content-Type': 'application/json;charset=utf-8',
  Authorization: '',
}

const userAPI = {
  getUser(payload) {
    const config = useRuntimeConfig()
    const { access_token } = payload
    headers.Authorization = 'Bearer ' + config.public.JGToken
    return axios.get('/Re6uybzQp3UK/data', {
      baseURL: config.public.JGUrl,
      headers,
    })
  },
}

export default userAPI