import './PageContainer.css'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'

export default function PageContainer({ children }) {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main">{children}</main>
      <Footer />
    </div>
  )
}
