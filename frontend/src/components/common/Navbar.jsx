import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiBookOpen, FiUser, FiLogOut, FiLogIn, FiUserPlus, FiGrid } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const navLink = (to, label) => (
    <Link
      to={to}
      style={{
        fontSize: 14, fontWeight: 600, color: pathname === to ? '#185FA5' : '#475569',
        textDecoration: 'none', padding: '6px 12px', borderRadius: 8,
        background: pathname === to ? '#E6F1FB' : 'transparent',
        transition: 'all 0.2s'
      }}
    >
      {label}
    </Link>
  )

  return (
    <nav style={{
      background: 'white', borderBottom: '1px solid #E2E8F0',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', height: 64
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 32 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #185FA5, #378ADD)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FiBookOpen size={18} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#042C53' }}>EduCommerce</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {navLink('/', 'Home')}
          {user && user.role === 'ROLE_USER' && (
            <>
              {navLink('/courses', 'Courses')}
              {navLink('/my-courses', 'My Courses')}
            </>
          )}
          {user && user.role === 'ROLE_ADMIN' && (
            navLink('/admin', 'Dashboard')
          )}
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!user ? (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <FiLogIn size={14} /> Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <FiUserPlus size={14} /> Register
              </Link>
            </>
          ) : (
            <>
              {user.role === 'ROLE_USER' && (
                <Link to="/profile" style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  textDecoration: 'none', padding: '6px 12px', borderRadius: 8,
                  background: pathname === '/profile' ? '#E6F1FB' : 'transparent'
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: '#185FA5', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{user.name}</span>
                </Link>
              )}
              {user.role === 'ROLE_ADMIN' && (
                <Link to="/admin" className="btn btn-secondary btn-sm">
                  <FiGrid size={14} /> Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-sm" style={{
                background: '#FEF2F2', color: '#DC2626',
                border: '1.5px solid #FECACA'
              }}>
                <FiLogOut size={14} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
