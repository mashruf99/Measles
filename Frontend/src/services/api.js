import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

export const getChildren = () => api.get('/children')

export const createChild = (payload) => api.post('/children', payload)

export const getSchedule = (childId) => api.get(`/schedule/${childId}`)

export const checkSymptoms = (payload) => api.post('/symptom-check', payload)