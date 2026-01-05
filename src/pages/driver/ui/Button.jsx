// src/ui/Button.jsx
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  onClick,
  style = {},
}) {
  const baseStyle = {
    padding: '10px 16px',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    border: '1px solid transparent',
    transition: 'all .15s ease',
  }

  const variants = {
    primary: { background: '#f97316', color: '#fff', borderColor: '#f97316' },
    secondary: { background: '#fff', color: '#111', borderColor: '#ddd' },
    danger: { background: '#ef4444', color: '#fff', borderColor: '#ef4444' },
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...baseStyle, ...(variants[variant] || variants.primary), ...style }}
    >
      {children}
    </button>
  )
}
