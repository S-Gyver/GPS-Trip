import PageContainer from '../../../components/layout/PageContainer/PageContainer'
import Button from '../../../components/ui/Button/Button'
import './BookingPage.css'

import { useMemo, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useBookingLogic } from '../useBookingForm'

// sections
import BookingStepper from './sections/BookingStepper'
import StepTripInfo from './sections/StepTripInfo'
import StepRoutes from './sections/StepRoutes'
import StepOneway from './sections/StepOneway' // ✅ เพิ่ม
import StepCoordinator from './sections/StepCoordinator'
import StepSummary from './sections/StepSummary'

export default function BookingPage() {
  const [step, setStep] = useState(1)

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
      // ===== Step 1 =====
      vehicleType: 'van',
      tripType: 'oneway',
      travelDate: '',
      departTime: '',
      returnDate: '',
      returnTime: '',
      purpose: '',
      passengersCount: 1,

      // ===== Step 3 =====
      coordinatorName: '',
      coordinatorPhone: '',
      showCoordinatorToPassengers: true,

      needApproval: false,
      approverName: '',

      openJoin: false,
      seatCapacity: 10,

      companions: [{ fullName: '', phone: '' }],

      // ===== Step 2 =====
      days: [
        {
          start: { label: '' },
          end: { label: '' },
          returnStart: { label: '' },
          returnEnd: { label: '' },
          stops: [{ place: '', time: '' }], // ✅
          note: '',
        },
      ],

    },
  })

  const { fields: dayFields, append: appendDay, remove: removeDay } = useFieldArray({
    control,
    name: 'days',
  })

  const { fields: compFields, append: appendComp, remove: removeComp } = useFieldArray({
    control,
    name: 'companions',
  })

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

  const { loading, error, submit } = useBookingLogic()

  const addDay = () => {
  if (dayFields.length >= 4) return
  appendDay({
    day: dayFields.length + 1,
    start: { label: '', lat: null, lng: null },
    end: { label: '', lat: null, lng: null },
    returnStart: { label: '', lat: null, lng: null },
    returnEnd: { label: '', lat: null, lng: null },

    stops: [{ place: '', time: '' }], // ✅ เพิ่ม
    note: '',                         // ✅ เพิ่ม
  })
}


  // ===== validate แต่ละ step =====
  const goNext = async () => {
    if (loading) return
    let ok = true

    if (step === 1) {
      const targets = [
        'vehicleType',
        'tripType',
        'travelDate',
        'departTime',
        'purpose',
        'passengersCount',
      ]
      if (tripType === 'roundtrip') {
        targets.push('returnDate', 'returnTime')
      }
      ok = await trigger(targets, { shouldFocus: true })
    }

    if (step === 2) {
      const targets = []
      dayFields.forEach((_, idx) => {
        targets.push(`days.${idx}.start.label`)
        targets.push(`days.${idx}.end.label`)
        if (tripType === 'roundtrip') {
          targets.push(`days.${idx}.returnStart.label`)
          targets.push(`days.${idx}.returnEnd.label`)
        }
      })
      ok = await trigger(targets, { shouldFocus: true })
    }

    if (step === 3) {
      const targets = [
        'coordinatorName',
        'coordinatorPhone',
        ...(needApproval ? ['approverName'] : []),
        ...(openJoin ? ['seatCapacity'] : []),
      ]
      ok = await trigger(targets, { shouldFocus: true })
    }

    if (!ok) return
    setStep((s) => Math.min(s + 1, 4))
  }

  const goBack = () => setStep((s) => Math.max(s - 1, 1))

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      purpose: (data.purpose || '').trim(),
      coordinatorName: (data.coordinatorName || '').trim(),
      coordinatorPhone: (data.coordinatorPhone || '').trim(),
      approverName: (data.approverName || '').trim(),
      passengersCount: Number(data.passengersCount || 1),
      seatCapacity: Number(data.seatCapacity || 0),
      companions: (data.companions || []).map((c) => ({
        fullName: (c.fullName || '').trim(),
        phone: (c.phone || '').trim(),
      })),
      days: (data.days || []).map((d, i) => ({
        ...d,
        day: i + 1,
        start: { ...d.start, label: (d.start?.label || '').trim() },
        end: { ...d.end, label: (d.end?.label || '').trim() },
        returnStart: { ...d.returnStart, label: (d.returnStart?.label || '').trim() },
        returnEnd: { ...d.returnEnd, label: (d.returnEnd?.label || '').trim() },
      })),
    }

    return submit(payload)
  }

  return (
    <PageContainer>
      <div className="bk-wrap">
        <h1 className="bk-title">เริ่มจองการเดินทาง</h1>
        <p className="bk-sub">ระบบจองรถภายในองค์กร (รองรับหลายวัน Day 1–4)</p>

        <BookingStepper step={step} />

        {error && <div className="bk-alert">{error}</div>}

        <form className="bk-card" onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <StepTripInfo register={register} errors={errors} watch={watch} setValue={setValue} />
          )}

          {/* ✅ Step 2 สลับ component ตาม tripType */}
          {step === 2 &&
            (tripType === 'roundtrip' ? (
              <StepRoutes
                dayFields={dayFields}
                addDay={addDay}
                removeDay={removeDay}
                register={register}
                errors={errors}
                control={control}   // ✅ เพิ่มบรรทัดนี้
              />
            ) : (
              <StepOneway
                dayFields={dayFields}
                addDay={addDay}
                removeDay={removeDay}
                register={register}
                errors={errors}
                control={control}
              />
            ))}

          {step === 3 && (
            <StepCoordinator
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              openJoin={openJoin}
              seatsLeft={seatsLeft}
              seatCapacity={seatCapacity}
              passengersCount={passengersCount}
              compFields={compFields}
              appendComp={appendComp}
              removeComp={removeComp}
            />
          )}

          {step === 4 && (
            <StepSummary watch={watch} vehicleType={vehicleType} tripType={tripType} seatsLeft={seatsLeft} />
          )}

          <div className="bk-actions-row">
            <Button type="button" variant="ghost" onClick={goBack} disabled={loading || step === 1}>
              ย้อนกลับ
            </Button>

            {step < 4 ? (
              <Button type="button" onClick={goNext} disabled={loading}>
                ถัดไป
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading ? 'กำลังบันทึก...' : 'ยืนยันการจอง'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </PageContainer>
  )
}
