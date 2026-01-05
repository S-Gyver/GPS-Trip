// src/lib/session.js
const KEY = 'ts_user'

export function getSessionUser() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null')
  } catch {
    return null
  }
}

export function setSessionUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user))
  window.dispatchEvent(new Event('ts_user_changed'))
}

export function clearSessionUser() {
  localStorage.removeItem(KEY)
  window.dispatchEvent(new Event('ts_user_changed'))
}
