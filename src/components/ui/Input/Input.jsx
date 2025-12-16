import { forwardRef } from 'react'
import './Input.css'

const Input = forwardRef(function Input({ label, error, ...props }, ref) {
  return (
    <label className="ts-field">
      {label && <span className="ts-field__label">{label}</span>}

      <input
        ref={ref}
        className={`ts-input ${error ? 'is-error' : ''}`}
        {...props}
      />

      {error && <span className="ts-field__error">{error}</span>}
    </label>
  )
})

export default Input
