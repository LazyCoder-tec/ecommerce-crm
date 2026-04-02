import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { courseAPI } from '../../services/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'

const emptyForm = { title:'', description:'', imageUrl:'', price:'', instructor:'', duration:'', level:'Beginner' }

function CourseFormModal({ course, onClose, onSaved }) {
  const [form, setForm] = useState(course ? {
    title: course.title, description: course.description || '',
    imageUrl: course.imageUrl || '', price: course.price,
    instructor: course.instructor || '', duration: course.duration || '',
    level: course.level || 'Beginner'
  } : emptyForm)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.title || !form.price) return toast.error('Title and price are required')
    setLoading(true)
    try {
      const payload = { ...form, price: parseFloat(form.price) }
      const { data } = course
        ? await courseAPI.update(course.id, payload)
        : await courseAPI.create(payload)
      toast.success(data.message || (course ? 'Course updated!' : 'Course added successfully!'))
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <span className="modal-title">{course ? 'Edit Course' : 'Add New Course'}</span>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Course Title *</label>
            <input name="title" className="form-input" placeholder="e.g. Spring Boot Masterclass"
              value={form.title} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Description</label>
            <textarea name="description" className="form-input" rows={3} placeholder="Course description…"
              value={form.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Price (₹) *</label>
            <input name="price" type="number" className="form-input" placeholder="1999"
              value={form.price} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Level</label>
            <select name="level" className="form-input" value={form.level} onChange={handleChange}>
              {['Beginner','Intermediate','Advanced'].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Instructor</label>
            <input name="instructor" className="form-input" placeholder="John Doe"
              value={form.instructor} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Duration</label>
            <input name="duration" className="form-input" placeholder="20 hours"
              value={form.duration} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Image URL</label>
            <input name="imageUrl" className="form-input" placeholder="https://…"
              value={form.imageUrl} onChange={handleChange} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : (course ? 'Update Course' : 'Add Course')}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ course, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const handleDelete = async () => {
    setLoading(true)
    try {
      await courseAPI.delete(course.id)
      toast.success('Course deleted successfully!')
      onDeleted()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    } finally { setLoading(false) }
  }
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <span className="modal-title">Confirm Delete</span>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
            <p style={{ fontSize: 15, color: '#1E293B', fontWeight: 600, marginBottom: 8 }}>
              Delete "{course.title}"?
            </p>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>
              This action cannot be undone. All related data will be removed.
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CourseManagement() {
  const [courses, setCourses]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const [deleteCourse, setDeleteCourse] = useState(null)

  const fetchCourses = () => {
    setLoading(true)
    courseAPI.getAllAdmin()
      .then(r => setCourses(r.data))
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false))
  }

  useEffect(fetchCourses, [])

  const handleSaved = () => { setShowForm(false); setEditCourse(null); fetchCourses() }
  const handleDeleted = () => { setDeleteCourse(null); fetchCourses() }

  const levelBadge = { Beginner: 'badge-green', Intermediate: 'badge-blue', Advanced: 'badge-yellow' }

  return (
    <AdminLayout title="Course Management" subtitle="Add, edit or remove courses from your catalog">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <FiPlus size={15} /> Add New Course
        </button>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Course</th>
                <th>Instructor</th>
                <th>Price</th>
                <th>Level</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, i) => (
                <tr key={c.id}>
                  <td style={{ color: '#94A3B8', fontSize: 12 }}>{i + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 8, background: '#E6F1FB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, flexShrink: 0
                      }}>📚</div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#042C53', fontSize: 13 }}>{c.title}</div>
                        <div style={{ fontSize: 11, color: '#94A3B8', maxWidth: 200,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{c.instructor || '—'}</td>
                  <td style={{ fontWeight: 700, color: '#185FA5' }}>₹{c.price?.toLocaleString()}</td>
                  <td><span className={`badge ${levelBadge[c.level] || 'badge-gray'}`}>{c.level || '—'}</span></td>
                  <td style={{ fontSize: 13, color: '#475569' }}>{c.duration || '—'}</td>
                  <td>
                    <span className={`badge ${c.active ? 'badge-green' : 'badge-red'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm btn-secondary"
                        onClick={() => { setEditCourse(c); setShowForm(true) }}>
                        <FiEdit2 size={13} />
                      </button>
                      <button className="btn btn-sm btn-danger"
                        onClick={() => setDeleteCourse(c)}>
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <CourseFormModal
          course={editCourse}
          onClose={() => { setShowForm(false); setEditCourse(null) }}
          onSaved={handleSaved}
        />
      )}
      {deleteCourse && (
        <DeleteConfirmModal course={deleteCourse} onClose={() => setDeleteCourse(null)} onDeleted={handleDeleted} />
      )}
    </AdminLayout>
  )
}
