export default function BookingStepper({ step = 1 }) {
  return (
    <div className="bk-stepper" role="tablist" aria-label="ขั้นตอนการจอง">
      <div className={`bk-step ${step === 1 ? 'is-active' : ''}`}>1) ข้อมูลเบื้องต้น</div>
      <div className={`bk-step ${step === 2 ? 'is-active' : ''}`}>2) เวลา/สถานที่/เส้นทาง</div>
      <div className={`bk-step ${step === 3 ? 'is-active' : ''}`}>3) ผู้ประสานงาน/เงื่อนไข</div>
      <div className={`bk-step ${step === 4 ? 'is-active' : ''}`}>4) สรุป</div>
    </div>
  )
}
