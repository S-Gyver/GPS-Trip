export default function DriverPickList({
  vehicleType,        // ✅ เพิ่มมาใหม่: 'van' | 'bus' | 'car' | ''
  selectedId,
  onSelect,
  onOpenDetail,
}) {
  // mock data ก่อน (วันหลังค่อยเปลี่ยนเป็นดึงจาก API)
  const drivers = [
    // ===== VAN =====
    { id: 'v1', vehicleType: 'van', name: 'สมชาย ใจดี', phone: '0812345678', plate: '1กข 1234', seats: 10 },
    { id: 'v2', vehicleType: 'van', name: 'ณัฐวุฒิ ขยัน', phone: '0899999999', plate: '2ขค 8888', seats: 12 },

    // ===== BUS =====
    { id: 'b1', vehicleType: 'bus', name: 'อรทัย ใจเย็น', phone: '0822222222', plate: '3งจ 5555', seats: 40 },
    { id: 'b2', vehicleType: 'bus', name: 'วิชัย ใจนักเลง', phone: '0866666666', plate: '4กท 9999', seats: 45 },

    // ===== CAR =====
    { id: 'c1', vehicleType: 'car', name: 'มยุรี สุภาพ', phone: '0877777777', plate: '5ขย 1111', seats: 4 },
    { id: 'c2', vehicleType: 'car', name: 'ธนพล ใจดี', phone: '0888888888', plate: '6กม 2222', seats: 4 },
  ]

  // ✅ ถ้ายังไม่เลือกประเภทรถ ให้ไม่ต้องโชว์รายการ
  if (!vehicleType) return null

  // ✅ กรองตามประเภทรถ
  const filtered = drivers.filter((d) => d.vehicleType === vehicleType)

  const vehicleLabel =
    vehicleType === 'van' ? 'รถตู้' : vehicleType === 'bus' ? 'รถบัส' : 'รถยนต์'

  return (
    <div className="pick-wrap">
      <div className="pick-head">
        <h2 className="pick-title">เลือกรถ/คนขับ ({vehicleLabel})</h2>
        <div className="pick-sub">เลือก 1 รายการเพื่อจอง</div>
      </div>

      <div className="pick-list">
        {filtered.map((d) => {
          const active = selectedId === d.id

          return (
            <div
              key={d.id}
              className={`pick-card ${active ? 'is-active' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelect?.(d.id)}
              onKeyDown={(e) => e.key === 'Enter' && onSelect?.(d.id)}
            >
              <div className="pick-photos">
                <div className="pick-photo">รูปรถ</div>
                <div className="pick-photo">รูปคนขับ</div>
              </div>

              <div className="pick-info">
                <ul className="pick-bullets">
                  <li>ชื่อ นามสกุลคนขับ: {d.name}</li>
                  <li>เบอร์มือถือ: {d.phone}</li>
                  <li>ทะเบียนรถ: {d.plate}</li>
                  <li>ระบุจำนวนที่นั่ง: {d.seats}</li>
                </ul>
              </div>

              <button
                type="button"
                className="pick-more"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onOpenDetail?.(d)
                }}
              >
                เพิ่มเติม
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
