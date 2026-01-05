export function getSessionUser() {
  const stores = [localStorage, sessionStorage]
  const keys = ['ts_user', 'ts_session', 'ts_auth', 'session', 'user', 'auth', 'tripsync_session']

  for (const st of stores) {
    for (const k of keys) {
      const raw = st.getItem(k)
      if (!raw) continue
      try {
        const obj = JSON.parse(raw)
        const u = obj?.user || obj
        const name = u?.name || u?.username || u?.displayName
        if (name) return { user: u, raw: obj, key: k, store: st }
      } catch {}
    }
  }
  return { user: null, raw: null, key: null, store: null }
}

export function saveToTsUser(nextUser) {
  localStorage.setItem('ts_user', JSON.stringify(nextUser))
}

export function updateOriginalSession(stored, nextUser) {
  if (!stored?.store || !stored?.key) return
  const raw = stored.raw

  try {
    if (raw && typeof raw === 'object' && raw.user && typeof raw.user === 'object') {
      const nextRaw = { ...raw, user: { ...raw.user, ...nextUser } }
      stored.store.setItem(stored.key, JSON.stringify(nextRaw))
      return
    }
    if (raw && typeof raw === 'object') {
      const nextRaw = { ...raw, ...nextUser }
      stored.store.setItem(stored.key, JSON.stringify(nextRaw))
    }
  } catch {}
}
