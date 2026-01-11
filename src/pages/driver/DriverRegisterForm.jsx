// src/pages/driver/DriverRegisterForm.jsx
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import './DriverRegisterForm.css'

import { ID_PATTERN, PHONE_PATTERN, toPublicUrl } from './constants'
import { alertError, alertSuccess } from './ui/alerts'

import { getDriverProfile, commitDriver, uploadDriverFile } from '../driver/hooks/driverApi'

import PersonalSection from './components/PersonalSection'
import VehicleSection from './components/VehicleSection'
import VehicleImagesSection from './components/VehicleImagesSection' // ✅ เพิ่ม Import นี้
import DocumentsSection from './components/DocumentsSection'
import DriverAvatarCard from './components/DriverAvatarCard'
import DriverFormActions from './components/DriverFormActions'

function getSessionUser() {
  const keys = ['tripsync_user', 'user', 'auth_user', 'session_user']
  for (const k of keys) {
    try {
      const raw = localStorage.getItem(k)
      if (!raw) continue
      const json = JSON.parse(raw)
      if (json && typeof json === 'object') return json
    } catch {}
  }
  return null
}

export default function DriverRegisterForm() {
  const sessionUser = useMemo(() => getSessionUser(), [])
  const fallbackEmail = sessionUser?.email || ''

  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [existingAvatarUrl, setExistingAvatarUrl] = useState('')

  // ✅ path เอกสาร/รูป (โชว์ค้าง + ส่ง commit)
  const [docPaths, setDocPaths] = useState({
    driver_avatar: '',
    id_card_img: '',
    driver_license_img: '',
    criminal_record_img: '',
    vehicle_reg_img: '',
    insurance_compulsory_img: '',
    insurance_commercial_img: '',
    // ✅ เพิ่ม state สำหรับรูปรถใหม่ 5 ช่อง
    vehicle_outside_img: '',
    vehicle_inside_1: '',
    vehicle_inside_2: '',
    vehicle_inside_3: '',
    vehicle_inside_4: '',
  })

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, submitCount },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      idCard: '',
      birthDate: '',
      phone: '',

      plate: '',
      vehicleType: '',
      seats: '',
      make: '',
      model: '',
      engine: '',
      pricePerDay: '',
      licenseNo: '',
      inspection: '',
    },
  })

  // ✅ โหลดข้อมูลเดิมจาก DB
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await getDriverProfile()
        if (!alive) return

        if (res?.ok && res?.json?.ok && res.json.data) {
          const d = res.json.data

          setUserEmail(d.email || '')

          reset({
            firstName: d.first_name || '',
            lastName: d.last_name || '',
            idCard: d.id_card_no || '',
            birthDate: d.birth_date || '',
            phone: d.phone || '',

            plate: d.license_plate || '',
            vehicleType: d.vehicle_type || '',
            seats: d.seats ?? '',
            make: d.car_brand || '',
            model: d.car_model || '',
            engine: d.engine_cc ?? '',
            pricePerDay: d.price_per_day ?? '',
            licenseNo: d.driver_license_no || '',
            inspection: d.vehicle_inspection || '',
          })

          const nextDocPaths = {
            driver_avatar: d.driver_avatar || '',
            id_card_img: d.id_card_img || '',
            driver_license_img: d.driver_license_img || '',
            criminal_record_img: d.criminal_record_img || '',
            vehicle_reg_img: d.vehicle_reg_img || '',
            insurance_compulsory_img: d.insurance_compulsory_img || '',
            insurance_commercial_img: d.insurance_commercial_img || '',
            // ✅ Map ข้อมูลรูปรถจาก DB ลง State
            vehicle_outside_img: d.vehicle_outside_img || '',
            vehicle_inside_1: d.vehicle_inside_1 || '',
            vehicle_inside_2: d.vehicle_inside_2 || '',
            vehicle_inside_3: d.vehicle_inside_3 || '',
            vehicle_inside_4: d.vehicle_inside_4 || '',
          }

          setDocPaths((s) => ({ ...s, ...nextDocPaths }))
          setExistingAvatarUrl(nextDocPaths.driver_avatar ? toPublicUrl(nextDocPaths.driver_avatar) : '')
        } else {
          setUserEmail(fallbackEmail)
        }
      } catch {
        setUserEmail(fallbackEmail)
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [reset, fallbackEmail])

  // ✅ เลือกรูปแล้วอัปทันที (driver_avatar)
  const onPickAvatar = async (file) => {
    if (!file) return
    try {
      setSaving(true)

      const res = await uploadDriverFile({ field: 'driver_avatar', file })
      if (!res?.ok || !res?.json?.ok) {
        throw new Error(res?.json?.message || 'อัปโหลดไม่สำเร็จ')
      }

      const path = res.json.path || ''
      if (!path) throw new Error('ไม่ได้รับ path จาก server')

      setDocPaths((s) => ({ ...s, driver_avatar: path }))
      setExistingAvatarUrl(toPublicUrl(path))

      await alertSuccess('อัปโหลดสำเร็จ', 'อัปโหลดรูปคนขับแล้ว')
    } catch (e) {
      alertError('อัปโหลดไม่สำเร็จ', e?.message || 'ลองใหม่อีกครั้ง')
    } finally {
      setSaving(false)
    }
  }

  // ✅ รับ path จาก DocUpload แล้วเก็บ state
  const handleDocPathChange = (field, path) => {
    setDocPaths((s) => ({ ...s, [field]: path }))
  }

  const onSave = handleSubmit(async (form) => {
    try {
      setSaving(true)

      const payload = {
        first_name: (form.firstName || '').trim(),
        last_name: (form.lastName || '').trim(),
        phone: (form.phone || '').trim(),
        id_card_no: (form.idCard || '').trim(),
        birth_date: form.birthDate || null,

        license_plate: (form.plate || '').trim(),
        vehicle_type: form.vehicleType || null,
        seats: form.seats === '' ? null : Number(form.seats),
        car_brand: (form.make || '').trim(),
        car_model: (form.model || '').trim(),
        engine_cc: form.engine === '' ? null : Number(form.engine),
        price_per_day: form.pricePerDay === '' ? null : Number(form.pricePerDay),

        driver_license_no: (form.licenseNo || '').trim(),
        vehicle_inspection: (form.inspection || '').trim(),

        // ✅ ส่ง path ทั้งหมดไป Backend
        files: {
          driver_avatar: docPaths.driver_avatar || '',
          id_card_img: docPaths.id_card_img || '',
          driver_license_img: docPaths.driver_license_img || '',
          criminal_record_img: docPaths.criminal_record_img || '',
          vehicle_reg_img: docPaths.vehicle_reg_img || '',
          insurance_compulsory_img: docPaths.insurance_compulsory_img || '',
          insurance_commercial_img: docPaths.insurance_commercial_img || '',
          // --- เพิ่มส่งไป Backend ---
          vehicle_outside_img: docPaths.vehicle_outside_img || '',
          vehicle_inside_1: docPaths.vehicle_inside_1 || '',
          vehicle_inside_2: docPaths.vehicle_inside_2 || '',
          vehicle_inside_3: docPaths.vehicle_inside_3 || '',
          vehicle_inside_4: docPaths.vehicle_inside_4 || '',
        },
      }

      const res = await commitDriver(payload)
      if (!res?.ok || !res?.json?.ok) throw new Error(res?.json?.message || 'บันทึกไม่สำเร็จ')

      await alertSuccess('บันทึกสำเร็จ', 'ข้อมูลคนขับถูกบันทึกแล้ว')

    } catch (e) {
      alertError('บันทึกไม่สำเร็จ', e?.message || 'ลองใหม่อีกครั้ง')
    } finally {
      setSaving(false)
    }
  })

  const onReset = () => {
    reset()
    setExistingAvatarUrl('')
    setDocPaths({
      driver_avatar: '',
      id_card_img: '',
      driver_license_img: '',
      criminal_record_img: '',
      vehicle_reg_img: '',
      insurance_compulsory_img: '',
      insurance_commercial_img: '',
      // ✅ รีเซ็ตค่ารูปรถใหม่
      vehicle_outside_img: '',
      vehicle_inside_1: '',
      vehicle_inside_2: '',
      vehicle_inside_3: '',
      vehicle_inside_4: '',
    })
  }

  if (loading) return <div style={{ padding: 12 }}>กำลังโหลดข้อมูล...</div>

  return (
    <div className="dr-form">
      <DriverAvatarCard
        topPreview={existingAvatarUrl}
        label="รูปโปรไฟล์คนขับ"
        onPickPhoto={onPickAvatar}
        disabled={saving}
      />

      <PersonalSection
        register={register}
        errors={errors}
        submitCount={submitCount}
        patterns={{ ID_PATTERN, PHONE_PATTERN }}
        userEmail={userEmail || fallbackEmail}
      />

      <VehicleSection register={register} errors={errors} submitCount={submitCount} />

      {/* ✅ 6. แทรก Section รูปรถตรงนี้ */}
      <VehicleImagesSection
        docPaths={docPaths}
        onUploaded={handleDocPathChange}
        disabled={saving}
      />

      <DocumentsSection
        docPaths={docPaths}
        onUploaded={handleDocPathChange}
        disabled={saving}
      />

      <DriverFormActions saving={saving} onReset={onReset} onSubmit={onSave} />
    </div>
  )
}