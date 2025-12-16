import './Button.css'

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // primary | ghost | outline
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const isDisabled = disabled || loading

  const handleClick = (e) => {
    // ✅ กัน form submit แอบสำหรับปุ่มที่ไม่ใช่ submit
    if (type !== 'submit') e.preventDefault()
    if (isDisabled) return
    onClick?.(e)
  }

  return (
    <button
      type={type}
      className={`ts-btn ts-btn--${variant} ${loading ? 'is-loading' : ''} ${className}`}
      disabled={isDisabled}
      aria-busy={loading ? 'true' : 'false'}
      onClick={handleClick}
      {...props}
    >
      {loading && <span className="ts-btn__spinner" aria-hidden="true" />}
      <span className="ts-btn__label">{children}</span>
    </button>
  )
}
