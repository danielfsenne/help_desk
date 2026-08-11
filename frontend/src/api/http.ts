import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
})

const TOKEN_KEY = 'helpdesk.token'

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    http.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem(TOKEN_KEY)
    delete http.defaults.headers.common.Authorization
  }
}

const storedToken = localStorage.getItem(TOKEN_KEY)
if (storedToken) {
  setAuthToken(storedToken)
}
