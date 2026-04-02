import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiLogIn, FiBookOpen } from 'react-icons/fi'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [banError, setBanError] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError(''); setBanError(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError(''); setBanError(false)
    try {
      const { data } = await authAPI.login(form)
      login(data.user, data.token)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate(data.user.role === 'ROLE_ADMIN' ? '/admin' : '/courses')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      if (msg.toLowerCase().includes('banned')) {
        setBanError(true)
      } else {
        setError(msg)
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #E6F1FB 0%, #F8FAFC 100%)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Card */}
          <div className="card" style={{ padding: '40px 36px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg, #185FA5, #378ADD)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <FiBookOpen size={24} color="white" />
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#042C53', marginBottom: 6 }}>Welcome back</h1>
              <p style={{ fontSize: 14, color: '#94A3B8' }}>Sign in to your account to continue</p>
            </div>

            {/* Ban error */}
            {banError && (
              <div className="alert alert-danger" style={{ marginBottom: 20 }}>
                <strong>🚫 Account Banned</strong><br />
                Your account has been suspended by an administrator. Please contact support at{' '}
                <a href="mailto:support@educommerce.com" style={{ color: '#991B1B' }}>support@educommerce.com</a>
              </div>
            )}

            {error && !banError && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <FiMail size={13} style={{ marginRight: 5 }} />Email Address
                </label>
                <input
                  name="email" type="email" className="form-input"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange} required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FiLock size={13} style={{ marginRight: 5 }} />Password
                </label>
                <input
                  name="password" type="password" className="form-input"
                  placeholder="Enter your password"
                  value={form.password} onChange={handleChange} required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}
                style={{ width: '100%', padding: 13, fontSize: 15, marginTop: 8 }}>
                {loading
                  ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />Signing in…</>
                  : <><FiLogIn size={15} />Sign In</>}
              </button>
            </form>

            {/* Demo credentials */}
            <div style={{
              margin: '20px 0 0', background: '#F8FAFC', borderRadius: 10,
              padding: '14px 16px', border: '1px solid #E2E8F0'
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8 }}>Demo Credentials</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => setForm({ email:'admin@app.com', password:'admin123' })}
                  className="btn btn-sm btn-secondary">Admin</button>
                <button onClick={() => setForm({ email:'user@app.com', password:'user123' })}
                  className="btn btn-sm btn-secondary">User</button>
              </div>
            </div>

            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#94A3B8' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#185FA5', fontWeight: 700, textDecoration: 'none' }}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
