import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ─────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
}

// ── Courses ──────────────────────────────────────────────
export const courseAPI = {
  getAll:    ()         => api.get('/courses'),
  getAllAdmin:()         => api.get('/courses/admin/all'),
  getById:   (id)       => api.get(`/courses/${id}`),
  create:    (data)     => api.post('/courses', data),
  update:    (id, data) => api.put(`/courses/${id}`, data),
  delete:    (id)       => api.delete(`/courses/${id}`),
}

// ── Orders ───────────────────────────────────────────────
export const orderAPI = {
  getMyCourses: (userId) => api.get(`/orders/my-courses/${userId}`),
  getAll:       ()       => api.get('/orders/all'),
}

// ── Payment ──────────────────────────────────────────────
export const paymentAPI = {
  createIntent:   (data) => api.post('/payment/create-intent', data),
  confirmPayment: (data) => api.post('/payment/confirm', data),
}

// ── Feedback ─────────────────────────────────────────────
export const feedbackAPI = {
  submit:   (userId, data) => api.post(`/feedback/${userId}`, data),
  getAll:   ()             => api.get('/feedback/all'),
  markRead: (id)           => api.patch(`/feedback/${id}/read`),
}

// ── Admin ────────────────────────────────────────────────
export const adminAPI = {
  getStats:    ()           => api.get('/admin/stats'),
  getDailySales:()          => api.get('/admin/sales/daily'),
  getAllSales:  ()           => api.get('/admin/sales/all'),
  getUsers:    ()           => api.get('/admin/users'),
  toggleBan:   (userId)     => api.patch(`/admin/users/${userId}/ban`),
  addFollowUp: (data)       => api.post('/admin/followups', data),
  getFollowUps:(userId)     => api.get(`/admin/followups/${userId}`),
}

export default api
