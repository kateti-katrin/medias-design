// Утилиты для работы с Rails API и localStorage.
// ENV REACT_APP_API_URL прокидывается через webpack DefinePlugin.

const API_URL =
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) ||
  'http://localhost:3000'

const JWT_KEY = 'smysl_jwt'
const USER_KEY = 'smysl_user'

function getToken() {
  try {
    return window.localStorage.getItem(JWT_KEY)
  } catch (e) {
    return null
  }
}

function setToken(token) {
  try {
    window.localStorage.setItem(JWT_KEY, token)
  } catch (e) {}
}

function clearToken() {
  try {
    window.localStorage.removeItem(JWT_KEY)
    window.localStorage.removeItem(USER_KEY)
  } catch (e) {}
}

function getUser() {
  try {
    const raw = window.localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

function setUser(user) {
  try {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch (e) {}
}

/**
 * Базовый fetch к Rails API.
 * Если есть JWT в localStorage — добавляем Authorization: Bearer <token>.
 *
 * @param {string} path  — путь без хоста, например '/api/articles'
 * @param {object} opts  — { method, body, headers }
 * @returns {Promise<{ ok: boolean, status: number, data: any, headers: Headers }>}
 */
async function fetchAPI(path, opts = {}) {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`
  const token = getToken()

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(opts.headers || {})
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const init = {
    method: opts.method || 'GET',
    headers
  }

  if (opts.body !== undefined) {
    init.body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body)
  }

  let data = null
  let response

  try {
    response = await fetch(url, init)
  } catch (err) {
    return { ok: false, status: 0, data: { errors: [String(err)] }, headers: new Headers() }
  }

  try {
    data = await response.json()
  } catch (e) {
    data = null
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
    headers: response.headers
  }
}

// Пути API основного Rails-приложения.
const apiPaths = {
  login: '/api/login',
  logout: '/api/logout',
  articles: '/api/articles',
  article: (idOrSlug) => `/api/articles/${idOrSlug}`,
  ping: '/api/ping'
}

export const utilities = {
  API_URL,
  apiPaths,
  fetchAPI,
  getToken,
  setToken,
  clearToken,
  getUser,
  setUser
}
