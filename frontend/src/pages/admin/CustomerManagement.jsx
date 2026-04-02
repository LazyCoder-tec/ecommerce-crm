import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { FiSearch, FiSlash, FiCheckCircle, FiMessageSquare, FiX } from 'react-icons/fi'

function FollowUpModal({ user, onClose }) {
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingNotes, setFetchingNotes] = useState(true)

  useEffect(() => {
    adminAPI.getFollowUps(user.id)
      .then(r => setNotes(r.data))
      .finally(() => setFetchingNotes(false))
  }, [user.id])

  const handleAdd = async () => {
    if (!note.trim()) return toast.error('Note cannot be empty')
    setLoading(true)
    try {
      const { data } = await adminAPI.addFollowUp({ userId: user.id, note })
      setNotes(prev => [data, ...prev])
      setNote('')
      toast.success('Follow-up note added!')
    } catch { toast.error('Failed to add note') }
    finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <span className="modal-title">Follow-Ups — {user.name}</span>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Add Note</label>
            <textarea className="form-input" rows={3} placeholder="Write a CRM note about this customer…"
              value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={loading}>
            {loading ? 'Adding…' : 'Add Note'}
          </button>

          <div style={{ marginTop: 20, borderTop: '1px solid #E2E8F0', paddingTop: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 12 }}>
              History ({notes.length})
            </p>
            {fetchingNotes ? (
              <div className="page-loader" style={{ minHeight: 60 }}><div className="spinner" /></div>
            ) : notes.length === 0 ? (
              <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '16px 0' }}>No notes yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 240, overflowY: 'auto' }}>
                {notes.map(n => (
                  <div key={n.id} style={{
                    background: '#F8FAFC', borderRadius: 8, padding: '10px 14px',
                    border: '1px solid #E2E8F0', fontSize: 13
                  }}>
                    <p style={{ color: '#1E293B', marginBottom: 4 }}>{n.note}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>By {n.adminName}</span>
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CustomerManagement() {
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [followUpUser, setFollowUpUser] = useState(null)

  const fetchUsers = () => {
    setLoading(true)
    adminAPI.getUsers()
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoading(false))
  }

  useEffect(fetchUsers, [])

  const handleToggleBan = async (userId) => {
    try {
      const { data } = await adminAPI.toggleBan(userId)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, banned: data.banned } : u))
      toast.success(data.message)
    } catch { toast.error('Failed to update user') }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Customer Management" subtitle="View, manage and engage with your customers">
      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 360, marginBottom: 20 }}>
        <FiSearch size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
        <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search customers…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Stats row */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Customers', value: users.length },
          { label: 'Active', value: users.filter(u => !u.banned).length },
          { label: 'Banned', value: users.filter(u => u.banned).length },
        ].map(({ label, value }) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Courses Bought</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', background: '#E6F1FB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 13, color: '#185FA5', flexShrink: 0
                      }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 13, color: '#042C53' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: '#475569' }}>{u.email}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#185FA5' }}>{u.coursesPurchased || 0}</span>
                    <span style={{ color: '#94A3B8', fontSize: 12 }}> courses</span>
                  </td>
                  <td style={{ fontSize: 12, color: '#94A3B8' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <span className={`badge ${u.banned ? 'badge-red' : 'badge-green'}`}>
                      {u.banned ? '🚫 Banned' : '● Active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className={`btn btn-sm ${u.banned ? 'btn-success' : 'btn-danger'}`}
                        onClick={() => handleToggleBan(u.id)}
                      >
                        {u.banned ? <><FiCheckCircle size={13} /> Unban</> : <><FiSlash size={13} /> Ban</>}
                      </button>
                      <button className="btn btn-sm btn-secondary"
                        onClick={() => setFollowUpUser(u)}>
                        <FiMessageSquare size={13} /> Notes
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>No customers found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {followUpUser && (
        <FollowUpModal user={followUpUser} onClose={() => setFollowUpUser(null)} />
      )}
    </AdminLayout>
  )
}
