// src/pages/driver/components/DriverFormActions.jsx
import Button from '../../driver/ui/Button'

export default function DriverFormActions({ saving = false, onReset, onSubmit }) {
  return (
    <div
      className="dr-actions"
      style={{
        display: 'flex',
        gap: 12,
        marginTop: 16,
        justifyContent: 'flex-end',
      }}
    >
      <Button
        type="button"
        variant="secondary"
        onClick={onReset}
        disabled={saving}
      >
        รีเซ็ต
      </Button>

      <Button
        type="button"
        variant="primary"
        onClick={onSubmit}
        disabled={saving}
      >
        {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
      </Button>
    </div>
  )
}
