import './Footer.css'

export default function Footer() {
  return (
    <footer className="ts-footer">
      <div className="ts-footer__inner">
        <p className="ts-footer__brand">TripSync</p>
        <p className="ts-footer__copy">
          © {new Date().getFullYear()} TripSync
        </p>
      </div>
    </footer>
  )
}
