import React from 'react'

export default function UserDetailModal({ user, onClose }) {
  if (!user) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>ข้อมูลผู้ใช้งาน: {user.username}</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>เบอร์โทร:</strong> {user.phone || '-'}</p>
          <p><strong>เพศ:</strong> {user.gender || '-'}</p>
          <p><strong>วันเกิด:</strong> {user.birth_day ? `${user.birth_day}/${user.birth_month}/${user.birth_year}` : '-'}</p>
          <p><strong>Role:</strong> <span className="badge badge-admin">{user.role}</span></p>
          <p><strong>สถานะ:</strong> <span className={user.status === 'banned' ? 'text-red' : 'text-green'}>{user.status || 'active'}</span></p>
          <p><strong>วันที่สมัคร:</strong> {new Date(user.created_at).toLocaleString('th-TH')}</p>
        </div>
        <div className="modal-footer">
          <button className="btn-xs" onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  )
}