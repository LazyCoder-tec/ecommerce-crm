import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiLock, FiUserPlus, FiBookOpen } from 'react-icons/fi'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true); setError('')
    try {
      const { data } = await authAPI.register({
        name: form.name, email: form.email, password: form.password
      })
      login(data.user, data.token)
      toast.success(`Welcome, ${data.user.name}! 🎉`)
      navigate('/courses')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #E6F1FB 0%, #F8FAFC 100%)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div className="card" style={{ padding: '40px 36px' }}>

            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg, #185FA5, #378ADD)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <FiBookOpen size={24} color="white" />
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#042C53', marginBottom: 6 }}>Create account</h1>
              <p style={{ fontSize: 14, color: '#94A3B8' }}>Start your learning journey today</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label"><FiUser size={13} style={{ marginRight: 5 }} />Full Name</label>
                <input name="name" className="form-input" placeholder="John Doe"
                  value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label"><FiMail size={13} style={{ marginRight: 5 }} />Email Address</label>
                <input name="email" type="email" className="form-input" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label"><FiLock size={13} style={{ marginRight: 5 }} />Password</label>
                <input name="password" type="password" className="form-input" placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label"><FiLock size={13} style={{ marginRight: 5 }} />Confirm Password</label>
                <input name="confirm" type="password" className="form-input" placeholder="Repeat password"
                  value={form.confirm} onChange={handleChange} required />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}
                style={{ width: '100%', padding: 13, fontSize: 15, marginTop: 4 }}>
                {loading
                  ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />Creating account…</>
                  : <><FiUserPlus size={15} />Create Account</>}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#94A3B8' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#185FA5', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
