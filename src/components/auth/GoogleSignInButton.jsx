import { useEffect, useRef } from 'react'

export default function GoogleSignInButton({ onCredential, disabled }) {
  const btnRef = useRef(null)

  useEffect(() => {
    if (!window.google || !btnRef.current) return

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (res) => {
        // res.credential = Google ID Token
        if (res?.credential) onCredential(res.credential)
      },
    })

    // วาดปุ่ม Google ให้
    window.google.accounts.id.renderButton(btnRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width: 360,
    })
  }, [onCredential])

  return (
    <div style={{ opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      <div ref={btnRef} />
    </div>
  )
}
