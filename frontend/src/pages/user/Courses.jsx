import { useState, useEffect } from 'react'
import { courseAPI, orderAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/common/Navbar'
import CheckoutModal from '../../components/user/CheckoutModal'
import toast from 'react-hot-toast'
import { FiSearch, FiClock, FiBarChart2, FiUser, FiCheckCircle } from 'react-icons/fi'

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced']

function CourseCard({ course, purchased, onBuy }) {
  const levelColor = { Beginner: 'green', Intermediate: 'blue', Advanced: 'yellow' }[course.level] || 'gray'

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(24,95,165,0.14)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>

      {/* Thumbnail */}
      <div style={{ height: 160, overflow: 'hidden', position: 'relative', background: '#E6F1FB' }}>
        {course.imageUrl ? (
          <img src={course.imageUrl} alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 48 }}>📚</span>
          </div>
        )}
        <span className={`badge badge-${levelColor}`}
          style={{ position: 'absolute', top: 10, left: 10 }}>
          {course.level || 'Course'}
        </span>
        {purchased && (
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
            background: 'rgba(22,163,74,0.85)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', color: 'white'
          }}>
            <FiCheckCircle size={32} style={{ marginBottom: 6 }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Purchased</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '18px 18px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#042C53', marginBottom: 8, lineHeight: 1.4 }}>
          {course.title}
        </h3>
        <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6, marginBottom: 12, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description}
        </p>

        {/* Meta */}
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
          {course.level && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#475569' }}>
              <FiBarChart2 size={12} /> {course.level}
            </span>
          )}
        </div>

        {/* Price + Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#185FA5' }}>
            ₹{course.price?.toLocaleString()}
          </span>
          {purchased ? (
            <span className="badge badge-green" style={{ fontSize: 12, padding: '6px 14px' }}>
              ✓ Owned
            </span>
          ) : (
            <button onClick={() => onBuy(course)} className="btn btn-primary btn-sm">
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [myCourseIds, setMyCourseIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All')
  const [selectedCourse, setSelectedCourse] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, myRes] = await Promise.all([
          courseAPI.getAll(),
          orderAPI.getMyCourses(user.id)
        ])
        setCourses(coursesRes.data)
        setMyCourseIds(new Set(myRes.data.map(c => c.id)))
      } catch {
        toast.error('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user.id])

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                        c.instructor?.toLowerCase().includes(search.toLowerCase())
    const matchLevel  = level === 'All' || c.level === level
    return matchSearch && matchLevel
  })

  const handlePurchaseSuccess = () => {
    setMyCourseIds(prev => new Set([...prev, selectedCourse.id]))
    setSelectedCourse(null)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #042C53, #185FA5)', padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: 'white', marginBottom: 6 }}>Course Catalog</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 24 }}>
            {courses.length} courses available · Master new skills today
          </p>

          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
              <FiSearch size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input className="form-input" placeholder="Search courses or instructors…"
                style={{ paddingLeft: 38, background: 'rgba(255,255,255,0.95)' }}
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {LEVELS.map(l => (
                <button key={l} onClick={() => setLevel(l)}
                  className="btn btn-sm"
                  style={{
                    background: level === l ? 'white' : 'rgba(255,255,255,0.15)',
                    color: level === l ? '#185FA5' : 'white',
                    border: 'none', fontWeight: level === l ? 700 : 500
                  }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ color: '#042C53', fontSize: 18, fontWeight: 700 }}>No courses found</h3>
            <p style={{ color: '#94A3B8' }}>Try a different search or filter</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {filtered.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                purchased={myCourseIds.has(course.id)}
                onBuy={setSelectedCourse}
              />
            ))}
          </div>
        )}
      </div>

      {selectedCourse && (
        <CheckoutModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  )
}
