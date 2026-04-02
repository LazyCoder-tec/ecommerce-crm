import { useState, useEffect } from 'react'
import { orderAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import FeedbackModal from '../../components/user/FeedbackModal'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiMessageSquare, FiClock, FiUser, FiBook } from 'react-icons/fi'

export default function MyCourses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [feedbackCourse, setFeedbackCourse] = useState(null)

  useEffect(() => {
    orderAPI.getMyCourses(user.id)
      .then(r => setCourses(r.data))
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false))
  }, [user.id])

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #042C53, #185FA5)', padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: 'white', marginBottom: 6 }}>My Courses</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
            {courses.length} course{courses.length !== 1 ? 's' : ''} in your library
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📚</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#042C53', marginBottom: 12 }}>
              No courses yet
            </h2>
            <p style={{ color: '#94A3B8', marginBottom: 24 }}>
              Browse our catalog and purchase your first course!
            </p>
            <Link to="/courses" className="btn btn-primary btn-lg">Browse Courses</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {courses.map(course => (
              <div key={course.id} className="card" style={{ overflow: 'hidden' }}>
                {/* Image */}
                <div style={{ height: 150, background: '#E6F1FB', position: 'relative' }}>
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                      📖
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    background: '#16A34A', color: 'white', fontSize: 11,
                    fontWeight: 700, padding: '3px 10px', borderRadius: 99
                  }}>
                    ✓ Purchased
                  </div>
                </div>

                <div style={{ padding: '18px 18px 14px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#042C53', marginBottom: 10, lineHeight: 1.4 }}>
                    {course.title}
                  </h3>

                  <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
                    {course.instructor && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#475569' }}>
                        <FiUser size={12} /> {course.instructor}
                      </span>
                    )}
                    {course.duration && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#475569' }}>
                        <FiClock size={12} /> {course.duration}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setFeedbackCourse(course)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <FiMessageSquare size={13} /> Feedback
                    </button>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                      <FiBook size={13} /> Start Learning
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {feedbackCourse && (
        <FeedbackModal course={feedbackCourse} onClose={() => setFeedbackCourse(null)} />
      )}
    </div>
  )
}
