import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FiGrid, FiBook, FiUsers, FiDollarSign,
  FiMessageSquare, FiPhoneCall, FiLogOut, FiBookOpen
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const links = [
  { to: '/admin',           icon: FiGrid,          label: 'Dashboard'   },
  { to: '/admin/courses',   icon: FiBook,          label: 'Courses'     },
  { to: '/admin/customers', icon: FiUsers,         label: 'Customers'   },
  { to: '/admin/sales',     icon: FiDollarSign,    label: 'Sales'       },
  { to: '/admin/feedback',  icon: FiMessageSquare, label: 'Feedback'    },
  { to: '/admin/followups', icon: FiPhoneCall,     label: 'Follow Ups'  },
]

export default function AdminSidebar() {
  const { pathname } = useLocation()
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/')
  }

  return (
    <aside style={{
      width: 240, minHeight: '100vh', background: '#042C53',
      display: 'flex', flexDirection: 'column', flexShrink: 0
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #378ADD, #185FA5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FiBookOpen size={18} color="white" />
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 15 }}>EduCommerce</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Admin info */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#378ADD', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{user?.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>Administrator</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {links.map(({ to, icon: Icon, label }) => {
          const active = pathname === to
          return (
            <Link key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 10, marginBottom: 2,
              textDecoration: 'none', transition: 'all 0.15s',
              background: active ? 'rgba(55,138,221,0.2)' : 'transparent',
              color: active ? '#85B7EB' : 'rgba(255,255,255,0.6)',
              fontWeight: active ? 700 : 500, fontSize: 14,
              borderLeft: active ? '3px solid #378ADD' : '3px solid transparent'
            }}>
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '11px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
          background: 'rgba(220,38,38,0.12)', color: '#FCA5A5',
          fontWeight: 600, fontSize: 14, fontFamily: 'inherit', transition: 'all 0.15s'
        }}>
          <FiLogOut size={17} /> Logout
        </button>
      </div>
    </aside>
  )
}
