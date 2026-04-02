import { useState, useEffect } from 'react'
import { orderAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import { Link } from 'react-router-dom'
import { FiUser, FiMail, FiCalendar, FiBook, FiArrowRight } from 'react-icons/fi'

export default function Profile() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.getMyCourses(user.id)
      .then(r => setCourses(r.data))
      .finally(() => setLoading(false))
  }, [user.id])

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Navbar />

      {/* Banner */}
      <div style={{ background: 'linear-gradient(135deg, #042C53, #185FA5)', height: 140 }} />

      <div style={{ maxWidth: 800, margin: '-70px auto 0', padding: '0 24px 48px' }}>
        {/* Profile card */}
        <div className="card" style={{ padding: '28px 28px 24px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #185FA5, #378ADD)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 28, fontWeight: 800,
              border: '4px solid white', boxShadow: '0 4px 16px rgba(24,95,165,0.25)',
              flexShrink: 0
            }}>
              {initials}
            </div>
            <div style={{ flex: 1, paddingTop: 8 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#042C53', marginBottom: 4 }}>{user.name}</h1>
              <span className="badge badge-blue">Student</span>
            </div>
            <Link to="/courses" className="btn btn-primary" style={{ marginTop: 8 }}>
              Browse Courses <FiArrowRight size={14} />
            </Link>
          </div>

          <div style={{ borderTop: '1px solid #E2E8F0', marginTop: 20, paddingTop: 20 }}>
            <div className="grid-3" style={{ gap: 12 }}>
              {[
                { icon: FiMail,     label: 'Email',  value: user.email },
                { icon: FiUser,     label: 'Role',   value: 'Student' },
                { icon: FiCalendar, label: 'Member', value: 'Since 2025' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{
                  background: '#F8FAFC', borderRadius: 10, padding: '14px 16px',
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Icon size={14} color="#94A3B8" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-3" style={{ gap: 16, marginBottom: 20 }}>
          <div className="stat-card">
            <div className="stat-label">Courses Purchased</div>
            <div className="stat-value">{courses.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Invested</div>
            <div className="stat-value" style={{ fontSize: 22 }}>
              ₹{courses.reduce((s, c) => s + (c.price || 0), 0).toLocaleString()}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Account Status</div>
            <div style={{ marginTop: 8 }}>
              <span className="badge badge-green" style={{ fontSize: 13 }}>● Active</span>
            </div>
          </div>
        </div>

        {/* My courses preview */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#042C53' }}>My Courses</h2>
            <Link to="/my-courses" style={{ fontSize: 13, color: '#185FA5', fontWeight: 600, textDecoration: 'none' }}>
              View all <FiArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="page-loader" style={{ minHeight: 80 }}><div className="spinner" /></div>
          ) : courses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#94A3B8' }}>
              <FiBook size={32} style={{ marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
              <p style={{ fontSize: 14 }}>No courses yet. <Link to="/courses" style={{ color: '#185FA5' }}>Browse courses</Link></p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {courses.slice(0,4).map(c => (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px',
                  background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0'
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, background: '#E6F1FB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    📖
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#042C53' }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>{c.instructor}</div>
                  </div>
                  <span className="badge badge-green">Owned</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
