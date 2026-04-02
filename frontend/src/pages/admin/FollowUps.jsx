import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { FiSearch, FiMessageSquare, FiX, FiPlus } from 'react-icons/fi'

function UserFollowUpDrawer({ user, onClose }) {
  const [notes, setNotes]   = useState([])
  const [note, setNote]     = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    adminAPI.getFollowUps(user.id)
      .then(r => setNotes(r.data))
      .finally(() => setFetching(false))
  }, [user.id])

  const handleAdd = async () => {
    if (!note.trim()) return toast.error('Please write a note')
    setLoading(true)
    try {
      const { data } = await adminAPI.addFollowUp({ userId: user.id, note })
      setNotes(prev => [data, ...prev])
      setNote('')
      toast.success('Note added!')
    } catch { toast.error('Failed to add note') }
    finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 540 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Follow-Up Notes</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{user.name} · {user.email}</div>
          </div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">New Note</label>
            <textarea className="form-input" rows={3}
              placeholder="Add a follow-up note about this customer (e.g. interested in advanced course, needs discount code…)"
              value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={loading}>
            <FiPlus size={13} /> {loading ? 'Adding…' : 'Add Note'}
          </button>

          <div style={{ marginTop: 24, borderTop: '1px solid #E2E8F0', paddingTop: 18 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 14 }}>
              Note History ({notes.length})
            </p>
            {fetching ? (
              <div className="page-loader" style={{ minHeight: 60 }}><div className="spinner" /></div>
            ) : notes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#94A3B8', fontSize: 13 }}>
                No notes yet. Add the first one above.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto' }}>
                {notes.map(n => (
                  <div key={n.id} style={{
                    background: '#F8FAFC', borderRadius: 10, padding: '12px 14px',
                    border: '1px solid #E2E8F0', borderLeft: '3px solid #378ADD'
                  }}>
                    <p style={{ fontSize: 14, color: '#1E293B', lineHeight: 1.5, marginBottom: 8 }}>{n.note}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8' }}>
                      <span>by {n.adminName}</span>
                      <span>{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</span>
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

export default function FollowUps() {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    adminAPI.getUsers()
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="CRM — Follow Ups" subtitle="Manage customer relationships and notes">
      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        <strong>CRM Module:</strong> Add notes and follow-up reminders for each customer to improve engagement and retention.
      </div>

      <div style={{ position: 'relative', maxWidth: 360, marginBottom: 24 }}>
        <FiSearch size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
        <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search customers…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(u => (
            <div key={u.id} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%', background: '#E6F1FB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 16, color: '#185FA5', flexShrink: 0
                }}>
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#042C53',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.email}
                  </div>
                </div>
                <span className={`badge ${u.banned ? 'badge-red' : 'badge-green'}`} style={{ flexShrink: 0 }}>
                  {u.banned ? 'Banned' : 'Active'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#F8FAFC', borderRadius: 8, padding: '8px 12px', marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: '#475569' }}>Courses purchased</span>
                <span style={{ fontWeight: 700, color: '#185FA5' }}>{u.coursesPurchased || 0}</span>
              </div>

              <button className="btn btn-secondary" style={{ width: '100%', fontSize: 13 }}
                onClick={() => setSelected(u)}>
                <FiMessageSquare size={14} /> View / Add Notes
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#94A3B8' }}>
              No customers found
            </div>
          )}
        </div>
      )}

      {selected && <UserFollowUpDrawer user={selected} onClose={() => setSelected(null)} />}
    </AdminLayout>
  )
}
