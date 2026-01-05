import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button/Button'

export default function ProfilePage() {
  const navigate = useNavigate()

  return (
    <>
      {/* ส่วนอื่น ๆ ของหน้า */}

      <Button
        onClick={() => navigate('/driver/register')}
        style={{ width: '100%' }}
      >
        ไปหน้าสมัครคนขับ
      </Button>
    </>
  )
}
