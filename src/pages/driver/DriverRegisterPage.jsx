import PageContainer from '../../components/layout/PageContainer/PageContainer'
import './DriverRegisterPage.css'
import DriverRegisterForm from './DriverRegisterForm'

export default function DriverRegisterPage() {
  return (
    <PageContainer>
      <div className="dr-page">
        <h1 className="dr-title">ข้อมูลคนขับรถ</h1>
        <DriverRegisterForm />
      </div>
    </PageContainer>
  )
}
