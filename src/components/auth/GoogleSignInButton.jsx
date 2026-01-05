import { useEffect, useRef } from 'react'

const GSI_SRC = 'https://accounts.google.com/gsi/client'

function loadGsiScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve(true)

    const exist = document.querySelector(`script[src="${GSI_SRC}"]`)
    if (exist) {
      exist.addEventListener('load', () => resolve(true))
      exist.addEventListener('error', reject)
      return
    }

    const s = document.createElement('script')
    s.src = GSI_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve(true)
    s.onerror = reject
    document.head.appendChild(s)
  })
}

export default function GoogleSignInButton({ onCredential, disabled }) {
  const btnRef = useRef(null)
  const initedRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      if (!clientId) {
        console.error('❌ Missing VITE_GOOGLE_CLIENT_ID')
        return
      }

      await loadGsiScript()
      if (cancelled) return

      const g = window.google?.accounts?.id
      if (!g || !btnRef.current) return

      // ✅ init แค่ครั้งเดียวพอ (กัน navigator.credentials.get ซ้อน)
      if (!initedRef.current) {
        g.initialize({
          client_id: clientId,

          // ✅ บังคับใช้ popup + ปิด FedCM (แก้ NotAllowed/Abort)
          ux_mode: 'popup',
          use_fedcm_for_prompt: false,

          auto_select: false,
          cancel_on_tap_outside: true,

          callback: (res) => {
            const token = res?.credential
            if (!token) return
            onCredential?.(token)
          },
        })
        initedRef.current = true
      }

      // ✅ render ปุ่ม (เคลียร์ก่อนกันซ้อน)
      btnRef.current.innerHTML = ''
      g.renderButton(btnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: 360,
      })
    }

    run().catch((e) => console.error('❌ GSI init error', e))
    return () => {
      cancelled = true
    }
  }, [onCredential])

  return (
    <div style={{ opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <div ref={btnRef} />
    </div>
  )
}
