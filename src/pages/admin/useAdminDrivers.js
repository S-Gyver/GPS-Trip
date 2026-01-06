import { useState, useEffect, useMemo } from 'react'

// Helper เช็คข้อความ
const includes = (text, term) => (text || '').toLowerCase().includes(term.toLowerCase())

export function useAdminDrivers() {
    const [drivers, setDrivers] = useState([])
    const [loading, setLoading] = useState(true)

    // Filter states
    const [filterStatus, setFilterStatus] = useState('ALL') // ALL, pending, approved, rejected
    const [searchTerm, setSearchTerm] = useState('')

    // 1. โหลดข้อมูล
    const fetchDrivers = async () => {
        try {
            setLoading(true)
            const res = await fetch('http://localhost/tripsync_api/api/admin/get_drivers.php', {
                credentials: 'include'
            })
            const json = await res.json()
            if (json.ok) {
                setDrivers(json.data || [])
            }
        } catch (error) {
            console.error('Fetch drivers failed', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDrivers()
    }, [])

    // 2. คำนวณ Stats (Dashboard ด้านบน)
    const stats = useMemo(() => {
        return {
            total: drivers.length,
            pending: drivers.filter(d => d.status === 'pending').length,
            approved: drivers.filter(d => d.status === 'approved').length,
            rejected: drivers.filter(d => d.status === 'rejected').length,
        }
    }, [drivers])

    // 3. กรองข้อมูล (Search + Filter)
    const filteredDrivers = useMemo(() => {
    return drivers.filter(d => {
      // Filter by Status
      if (filterStatus !== 'ALL' && d.status !== filterStatus) return false
      
      // Filter by Search (Name, Plate, Phone)
      if (searchTerm) {
        const keyword = searchTerm.trim()
        
        // ✅ เช็คชื่อ (User, First, Last)
        const matchName = includes(d.first_name, keyword) || 
                          includes(d.last_name, keyword) || 
                          includes(d.username, keyword)
                          
        // ✅ เช็คทะเบียนรถ
        const matchPlate = includes(d.license_plate, keyword)
        
        // ⚠️ แก้ตรงนี้: เปลี่ยน d.phone เป็น d.user_phone (ตามที่ Backend ส่งมา)
        // หรือจะใส่ || เผื่อไว้ทั้ง 2 ชื่อก็ได้ครับ
        const matchPhone = includes(d.user_phone, keyword) || includes(d.phone, keyword)
        
        if (!matchName && !matchPlate && !matchPhone) return false
      }
      return true
        })
    }, [drivers, filterStatus, searchTerm])

    // 4. ฟังก์ชันเปลี่ยนสถานะ
    const updateStatus = async (userId, status) => {
        if (!window.confirm(`ยืนยันเปลี่ยนสถานะเป็น "${status}" ?`)) return

        try {
            const res = await fetch('http://localhost/tripsync_api/api/admin/update_driver_status.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, status }),
                credentials: 'include'
            })
            const json = await res.json()

            if (json.ok) {
                // อัปเดต state ในเครื่องทันที (ไม่ต้องโหลดใหม่ให้เสียเวลา)
                setDrivers(prev => prev.map(d => d.user_id === userId ? { ...d, status } : d))
            } else {
                alert(json.message || 'เกิดข้อผิดพลาด')
            }
        } catch (err) {
            alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้')
        }
    }

    return {
        loading,
        drivers: filteredDrivers,
        stats,
        filterStatus,
        setFilterStatus,
        searchTerm,
        setSearchTerm,
        updateStatus,
        refresh: fetchDrivers
    }
}