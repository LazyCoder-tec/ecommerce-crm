import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { feedbackAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { FiEye, FiCheck } from 'react-icons/fi'

const Stars = ({ rating }) => (
  <span className="stars">{Array.from({ length: 5 }, (_, i) => i < rating ? '★' : '☆').join('')}</span>
)

export default function FeedbackAdmin() {
  const [feedback, setFeedback]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all') // all | unread | read

  useEffect(() => {
    feedbackAPI.getAll()
      .then(r => setFeedback(r.data))
      .catch(() => toast.error('Failed to load feedback'))
      .finally(() => setLoading(false))
  }, [])

  const handleMarkRead = async (id) => {
    try {
      const { data } = await feedbackAPI.markRead(id)
      setFeedback(prev => prev.map(f => f.id === id ? { ...f, read: data.read } : f))
      toast.success('Marked as read')
    } catch { toast.error('Failed to update') }
  }

  const filtered = feedback.filter(f => {
    if (filter === 'unread') return !f.read
    if (filter === 'read')   return f.read
    return true
  })

  const unreadCount = feedback.filter(f => !f.read).length

  return (
    <AdminLayout title="Feedback" subtitle="View and manage customer feedback">
      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Feedback', value: feedback.length },
          { label: 'Unread',         value: unreadCount     },
          { label: 'Avg Rating',     value: feedback.length
              ? (feedback.reduce((s,f) => s + f.rating, 0) / feedback.length).toFixed(1) + ' ★'
              : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all','unread','read'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && (
              <span style={{
                background: filter === 'unread' ? 'rgba(255,255,255,0.3)' : '#DC2626',
                color: 'white', borderRadius: 99, padding: '1px 7px', fontSize: 11, marginLeft: 4
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#94A3B8' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
          <p>No feedback in this category</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(f => (
            <div key={f.id} className="card" style={{
              padding: '18px 20px',
              borderLeft: !f.read ? '4px solid #378ADD' : '4px solid transparent'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', background: '#E6F1FB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 13, color: '#185FA5', flexShrink: 0
                    }}>
                      {f.userName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: '#042C53' }}>{f.userName}</span>
                      <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 8 }}>{f.userEmail}</span>
                    </div>
                    <Stars rating={f.rating} />
                    {!f.read && <span className="badge badge-blue">New</span>}
                  </div>

                  <div style={{
                    background: '#F8FAFC', borderRadius: 8, padding: '10px 14px',
                    fontSize: 14, color: '#1E293B', lineHeight: 1.6, marginBottom: 10
                  }}>
                    {f.message}
                  </div>

                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94A3B8', flexWrap: 'wrap' }}>
                    <span>📚 {f.courseTitle}</span>
                    <span>📅 {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : '—'}</span>
                  </div>
                </div>

                {!f.read && (
                  <button className="btn btn-sm btn-success" onClick={() => handleMarkRead(f.id)}>
                    <FiCheck size={13} /> Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
