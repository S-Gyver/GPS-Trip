export default function StepSummary({ watch, vehicleType, tripType, seatsLeft }) {
  return (
    <div className="bk-summary">
      <h2 className="bk-sum-title">สรุปข้อมูลการจอง</h2>

      <div className="bk-sum-grid">
        <div className="bk-sum-item">
          <div className="bk-sum-k">ประเภทรถ</div>
          <div className="bk-sum-v">{vehicleType}</div>
        </div>
        <div className="bk-sum-item">
          <div className="bk-sum-k">รูปแบบ</div>
          <div className="bk-sum-v">{tripType}</div>
        </div>
        <div className="bk-sum-item">
          <div className="bk-sum-k">วันเดินทาง</div>
          <div className="bk-sum-v">{watch('travelDate') || '-'}</div>
        </div>
        <div className="bk-sum-item">
          <div className="bk-sum-k">เวลาไป</div>
          <div className="bk-sum-v">{watch('departTime') || '-'}</div>
        </div>
        <div className="bk-sum-item">
          <div className="bk-sum-k">วัตถุประสงค์</div>
          <div className="bk-sum-v">{watch('purpose') || '-'}</div>
        </div>
        <div className="bk-sum-item">
          <div className="bk-sum-k">จำนวนผู้โดยสาร</div>
          <div className="bk-sum-v">{watch('passengersCount')}</div>
        </div>
        <div className="bk-sum-item">
          <div className="bk-sum-k">เปิดรับผู้ร่วมทาง</div>
          <div className="bk-sum-v">{watch('openJoin') ? `เปิด (ว่าง ~${seatsLeft} ที่)` : 'ปิด'}</div>
        </div>
        <div className="bk-sum-item">
          <div className="bk-sum-k">ต้องมีผู้อนุมัติ</div>
          <div className="bk-sum-v">
            {watch('needApproval') ? `ใช่ (${watch('approverName') || '-'})` : 'ไม่'}
          </div>
        </div>
      </div>

      <div className="bk-sum-daylist">
        <div className="bk-label">เส้นทางรายวัน</div>
        {watch('days')?.map((d, i) => (
          <div key={i} className="bk-sum-day">
            <b>Day {i + 1}:</b> {d?.start?.label || '-'} → {d?.end?.label || '-'}
          </div>
        ))}
      </div>

      <div className="bk-sum-daylist">
        <div className="bk-label">ผู้ประสานงาน</div>
        <div className="bk-sum-day">
          {watch('coordinatorName') || '-'} • {watch('coordinatorPhone') || '-'}
          {watch('showCoordinatorToPassengers') ? ' • (เปิดเผยให้ผู้ร่วมเดินทาง)' : ' • (ไม่เปิดเผย)'}
        </div>
      </div>
    </div>
  )
}
