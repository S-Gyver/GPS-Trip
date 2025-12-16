import { useEffect, useMemo, useState } from 'react'
import { adminApproveBooking, adminListBookings, adminRejectBooking } from '../../services/adminBooking.api'

export function useAdminBookings() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL') // ALL | PENDING_APPROVAL | APPROVED | REJECTED

  const refresh = () => {
    try {
      setError('')
      setLoading(true)
      const data = adminListBookings()
      setItems(data)
    } catch (e) {
      setError(e?.message || 'โหลดรายการไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'ALL') return items
    return items.filter((b) => b.status === filter)
  }, [items, filter])

  const approve = (id) => {
    try {
      adminApproveBooking(id)
      refresh()
    } catch (e) {
      setError(e?.message || 'อนุมัติไม่สำเร็จ')
    }
  }

  const reject = (id) => {
    try {
      adminRejectBooking(id)
      refresh()
    } catch (e) {
      setError(e?.message || 'ไม่อนุมัติไม่สำเร็จ')
    }
  }

  return {
    loading,
    error,
    filter,
    setFilter,
    items: filtered,
    refresh,
    approve,
    reject,
  }
}
