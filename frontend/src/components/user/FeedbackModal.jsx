import { useState } from 'react'
import { feedbackAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { FiX, FiStar } from 'react-icons/fi'

export default function FeedbackModal({ course, onClose }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [hover, setHover] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) return toast.error('Please write a message')
    setLoading(true)
    try {
      await feedbackAPI.submit(user.id, { courseId: course.id, message, rating })
      toast.success('Feedback submitted! Thank you 🙏')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">Leave Feedback</span>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 13, color: '#475569', marginBottom: 16 }}>
            Share your experience with <strong>{course.title}</strong>
          </p>

          {/* Star rating */}
          <div className="form-group">
            <label className="form-label">Rating</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 28, color: star <= (hover || rating) ? '#F59E0B' : '#E2E8F0',
                    transition: 'color 0.1s', lineHeight: 1, padding: 0
                  }}
                >★</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Message</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="What did you like or dislike about this course?"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting…' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  )
}
