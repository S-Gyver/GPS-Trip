const API_BASE = 'http://localhost/tripsync_api'

export function useLogout({ navigate, stored }) {
  return async function onLogout() {
    try {
      await fetch(`${API_BASE}/api/auth/logout.php`, { method: 'POST', credentials: 'include' })
    } catch {}

    localStorage.removeItem('ts_token')
    localStorage.removeItem('ts_user')
    if (stored?.store && stored?.key) stored.store.removeItem(stored.key)

    window.dispatchEvent(new Event('ts_user_updated'))
    navigate('/login', { replace: true })
  }
}
