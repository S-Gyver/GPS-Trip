import './DriverSummaryCard.css' // (ถ้ามี css แยก)

const DOC_LIST = [
    { key: 'id_card_img', label: 'บัตรประชาชน' },
    { key: 'driver_license_img', label: 'ใบขับขี่' },
    { key: 'criminal_record_img', label: 'ประวัติอาชญากรรม' },
    { key: 'vehicle_reg_img', label: 'จดทะเบียนรถ' },
    { key: 'insurance_compulsory_img', label: 'พรบ.' },
    { key: 'insurance_commercial_img', label: 'ประกันเชิงพาณิชย์' },
]

const VEHICLE_LABEL = { car: '🚗 รถยนต์', van: '🚐 รถตู้', bus: '🚌 รถบัส' }
const STATUS_LABEL = {
    pending: 'รอตรวจสอบ',
    approved: 'อนุมัติแล้ว',
    rejected: 'ถูกปฏิเสธ',
    suspended: 'ถูกระงับ'
}

// Helper ดึงค่าแบบปลอดภัย
function val(v) {
    if (v === null || v === undefined || String(v).trim() === '') return '-'
    return v
}

function money(v) {
    const n = Number(v)
    if (!Number.isFinite(n) || n <= 0) return '-'
    return n.toLocaleString('th-TH')
}

export default function DriverSummaryCard({ raw = {} }) {
    // ดึงข้อมูลจาก raw object (ที่มาจาก DB)
    const d = raw || {}

    const fullName = `${d.first_name || ''} ${d.last_name || ''}`.trim()
    const statusKey = (d.status || 'pending').toLowerCase()
    const statusText = STATUS_LABEL[statusKey] || d.status || 'รอตรวจสอบ'

    // แปลงประเภทรถ
    const vt = (d.vehicle_type || '').toLowerCase()
    const vehicleText = VEHICLE_LABEL[vt] || val(d.vehicle_type)

    return (
        <div className="ds-card">
            <div className="ds-head">
                <div className="ds-title">สรุปข้อมูลคนขับ</div>
                {/* Badge สถานะ */}
                <div className={`ds-badge status-${statusKey}`}>
                    {statusText}
                </div>
            </div>

            <div className="ds-grid">
                <div className="ds-field">
                    <div className="ds-k">ชื่อ - นามสกุล</div>
                    <div className="ds-v">{val(fullName)}</div>
                </div>

                <div className="ds-field">
                    <div className="ds-k">ประเภทรถ</div>
                    <div className="ds-v">{vehicleText}</div>
                </div>

                {/* ✅ เพิ่มยี่ห้อรถ ตามที่ขอ */}
                <div className="ds-field">
                    <div className="ds-k">ยี่ห้อรถ</div>
                    <div className="ds-v">{val(d.car_brand)}</div>
                </div>

                <div className="ds-field">
                    <div className="ds-k">รุ่นรถ</div>
                    <div className="ds-v">{val(d.car_model)}</div>
                </div>

                <div className="ds-field">
                    <div className="ds-k">ราคา / วัน</div>
                    <div className="ds-v">{money(d.price_per_day)} บาท</div>
                </div>
            </div>

        </div>
    )
}