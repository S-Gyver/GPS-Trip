import PageContainer from '../../../components/layout/PageContainer/PageContainer'
import Button from '../../../components/ui/Button/Button'
import './BookingPage.css'

import { useMemo, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useBookingLogic } from '../useBookingForm'
import { useNavigate } from 'react-router-dom'

// ✅ Import Alerts (จากไฟล์ที่คุณเตรียมไว้)
import { alertSuccess, alertError, alertWarn, confirmAction } from '../ui/alerts'

// sections
import BookingStepper from './sections/BookingStepper'
import StepTripInfo from './sections/StepTripInfo'
import StepRoutes from './sections/StepRoutes'
import StepOneway from './sections/StepOneway'
import StepCoordinator from './sections/StepCoordinator'
import StepSummary from './sections/StepSummary'

// URL API
const API_URL = 'http://localhost/tripsync_api/api/booking/create_booking.php'

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      // Step 1
      vehicleType: '', 
      tripType: '',    
      travelDate: '',
      departTime: '',
      returnDate: '',
      returnTime: '',
      purpose: '',
      passengersCount: '', 
      selectedDriverId: '',

      // Step 3
      coordinatorName: '',
      coordinatorPhone1: '', 
      showCoordinatorToPassengers: true,
      needApproval: false,
      approverName: '',
      approverEmail: '', 
      openJoin: false,
      seatCapacity: '', 
      submitListLater: false, 
      companions: [{ fullName: '', phone: '' }],

      // Step 2
      days: [
        {
          start: { label: '' },
          end: { label: '' },
          returnStart: { label: '' },
          returnEnd: { label: '' },
          stops: [], 
          note: '',
        },
      ],
    },
  })

  const { fields: dayFields, append: appendDay, remove: removeDay } = useFieldArray({ control, name: 'days' })
  const { fields: compFields, append: appendComp, remove: removeComp } = useFieldArray({ control, name: 'companions' })

  const vehicleType = watch('vehicleType')
  const tripType = watch('tripType')
  const openJoin = watch('openJoin')
  const seatCapacity = watch('seatCapacity')
  const passengersCount = watch('passengersCount')
  const needApproval = watch('needApproval')

  const seatsLeft = useMemo(() => {
    const cap = Number(seatCapacity || 0)
    const used = Number(passengersCount || 0)
    return Math.max(cap - used, 0)
  }, [seatCapacity, passengersCount])

  const { loading, error } = useBookingLogic()

  const addDay = () => {
    if (dayFields.length >= 30) return 
    appendDay({ 
      day: dayFields.length + 1, 
      start: { label: '' }, 
      end: { label: '' }, 
      returnStart: { label: '' }, 
      returnEnd: { label: '' }, 
      stops: [], 
      note: '' 
    }, { shouldFocus: false }) 
  }

  // ✅ เปลี่ยนจาก alert() ธรรมดา เป็น alertWarn()
  const goNext = async () => {
    if (loading) return
    let ok = true

    if (step === 1) {
      const targets = ['vehicleType', 'tripType', 'purpose', 'passengersCount']
      const driverId = watch('selectedDriverId');
      
      if (!driverId) { 
         // ⚠️ แจ้งเตือนสวยๆ
         await alertWarn('กรุณาเลือกคนขับ', 'โปรดเลือกรถและคนขับก่อนดำเนินการต่อ')
         return; 
      }

      ok = await trigger(targets, { shouldFocus: true })
      if (ok) setStep(2)
    }

    else if (step === 2) {
      const targets = []
      dayFields.forEach((_, idx) => {
        targets.push(`days.${idx}.start.label`)
        targets.push(`days.${idx}.end.label`)
      })
      ok = await trigger(targets, { shouldFocus: true })
      if(ok) setStep(3)
    }
    
    else if (step === 3) {
      const targets = ['coordinatorName', 'coordinatorPhone1']
      if (needApproval) targets.push('approverName', 'approverEmail')
      if (openJoin) targets.push('seatCapacity')
      
      ok = await trigger(targets, { shouldFocus: true })
      if(ok) setStep(4)
    }
  }

  const goBack = () => setStep((s) => Math.max(s - 1, 1))

  // 🔥🔥🔥 ฟังก์ชันยืนยันการจอง (ใช้ confirmAction + alertSuccess) 🔥🔥🔥
  const onSubmit = async (data) => {
     // 1. ถามยืนยันก่อน
     const isConfirmed = await confirmAction({
        title: 'ยืนยันการจอง?',
        text: 'กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน',
        confirmText: 'ยืนยันการจอง',
        cancelText: 'ยกเลิก'
     })

     if (!isConfirmed) return; // ถ้ากด "ยกเลิก" ก็จบตรงนี้

     try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 41, 
                
                selectedDriverId: data.selectedDriverId,
                vehicleType: data.vehicleType,
                tripType: data.tripType,
                travelDate: data.travelDate || new Date().toISOString().split('T')[0], 
                departTime: data.departTime || '08:00',
                purpose: data.purpose,
                passengersCount: data.passengersCount,
                price: 0,
                
                days: data.days,

                coordinatorName: data.coordinatorName,
                coordinatorEmail: data.coordinatorEmail,
                coordinatorPhone1: data.coordinatorPhone1,
                showCoordinatorToPassengers: data.showCoordinatorToPassengers,
                needApproval: data.needApproval,
                approverName: data.approverName,
                approverEmail: data.approverEmail,
                openJoin: data.openJoin,
                seatCapacity: data.seatCapacity,
                submitListLater: data.submitListLater,
                companions: data.companions
            })
        });

        const json = await res.json();

        if (json.ok) {
            // ✅ 2. แจ้งเตือนสำเร็จสวยๆ
            await alertSuccess('จองสำเร็จเรียบร้อย!', `รหัสใบจอง: ${json.id}`)
            navigate('/trips'); 
        } else {
            // ❌ 3. แจ้งเตือน Error สวยๆ
            await alertError('บันทึกไม่สำเร็จ', json.message)
        }

     } catch (err) {
        await alertError('เกิดข้อผิดพลาด', err.message)
     }
  }

  return (
    <PageContainer>
      <div className="bk-wrap">
        <h1 className="bk-title">เริ่มจองการเดินทาง</h1>
        <p className="bk-sub">กรอกข้อมูลให้ครบถ้วนเพื่อจองรถ</p>

        <BookingStepper step={step} />

        {error && <div className="bk-alert">{error}</div>}

        <form className="bk-card" onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && <StepTripInfo register={register} errors={errors} watch={watch} setValue={setValue} />}
          
          {step === 2 && (tripType === 'roundtrip' ? 
              <StepRoutes tripType={tripType} dayFields={dayFields} addDay={addDay} removeDay={removeDay} register={register} errors={errors} control={control} /> : 
              <StepOneway tripType={tripType} dayFields={dayFields} addDay={addDay} removeDay={removeDay} register={register} errors={errors} control={control} />
          )}

          {step === 3 && <StepCoordinator register={register} errors={errors} watch={watch} setValue={setValue} openJoin={openJoin} seatsLeft={seatsLeft} seatCapacity={seatCapacity} passengersCount={passengersCount} compFields={compFields} appendComp={appendComp} removeComp={removeComp} />}

          {step === 4 && <StepSummary watch={watch} vehicleType={vehicleType} tripType={tripType} seatsLeft={seatsLeft} />}

          <div className="bk-actions-row">
            <Button type="button" variant="ghost" onClick={goBack} disabled={loading || step === 1}>ย้อนกลับ</Button>
            
            {step < 4 ? (
              <Button type="button" onClick={goNext} disabled={loading}>ถัดไป</Button>
            ) : (
              <Button type="submit" disabled={loading}>ยืนยันการจอง</Button>
            )}
          </div>
        </form>
      </div>
    </PageContainer>
  )
}