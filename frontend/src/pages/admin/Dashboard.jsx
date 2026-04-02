import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts'
import { FiUsers, FiBook, FiShoppingCart, FiDollarSign, FiTrendingUp, FiActivity } from 'react-icons/fi'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'white', border: '1px solid #E2E8F0', borderRadius: 10,
      padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', fontSize: 13
    }}>
      <p style={{ fontWeight: 700, color: '#042C53', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === 'revenue' ? `₹${Number(p.value).toLocaleString()}` : p.value} {p.name}
        </p>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats]       = useState({})
  const [daily, setDaily]       = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getDailySales()])
      .then(([sRes, dRes]) => { setStats(sRes.data); setDaily(dRes.data) })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { icon: FiUsers,       label: 'Total Users',    value: stats.totalUsers   || 0, color: '#185FA5', bg: '#E6F1FB' },
    { icon: FiBook,        label: 'Total Courses',  value: stats.totalCourses || 0, color: '#16A34A', bg: '#F0FDF4' },
    { icon: FiShoppingCart,label: 'Total Orders',   value: stats.totalOrders  || 0, color: '#D97706', bg: '#FFFBEB' },
    { icon: FiDollarSign,  label: 'Total Revenue',  value: `₹${Number(stats.totalRevenue || 0).toLocaleString()}`, color: '#7C3AED', bg: '#F5F3FF' },
  ]

  if (loading) return (
    <AdminLayout title="Dashboard">
      <div className="page-loader"><div className="spinner" /></div>
    </AdminLayout>
  )

  return (
    <AdminLayout title="Dashboard" subtitle="Your platform at a glance">

      {/* Stat cards */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {statCards.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} style={{
            background: 'white', borderRadius: 14, padding: '20px 22px',
            border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                  {label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#042C53' }}>{value}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's stats */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div style={{
          background: 'linear-gradient(135deg, #042C53, #185FA5)',
          borderRadius: 14, padding: '22px 24px', color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <FiActivity size={18} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>Today's Activity</span>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{stats.todayOrders || 0}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>Orders today</div>
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800 }}>₹{Number(stats.todayRevenue || 0).toLocaleString()}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>Revenue today</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 14, padding: '22px 24px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <FiTrendingUp size={18} color="#185FA5" />
            <span style={{ fontWeight: 700, fontSize: 15, color: '#042C53' }}>Quick Actions</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { to: '/admin/courses',   label: 'Add New Course'    },
              { to: '/admin/customers', label: 'Manage Customers'  },
              { to: '/admin/feedback',  label: 'Review Feedback'   },
            ].map(({ to, label }) => (
              <a key={to} href={to} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: 8, background: '#F8FAFC',
                border: '1px solid #E2E8F0', textDecoration: 'none',
                fontSize: 13, fontWeight: 600, color: '#475569', transition: 'all 0.15s'
              }}>
                {label} <span style={{ color: '#94A3B8' }}>→</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Sales Charts */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Bar chart - sales */}
        <div style={{ background: 'white', borderRadius: 14, padding: '22px 24px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#042C53', marginBottom: 20 }}>
            Daily Sales (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={daily} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="#378ADD" radius={[6,6,0,0]} name="sales" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart - revenue */}
        <div style={{ background: 'white', borderRadius: 14, padding: '22px 24px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#042C53', marginBottom: 20 }}>
            Daily Revenue (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="#185FA5" strokeWidth={2.5}
                dot={{ fill: '#185FA5', r: 4 }} name="revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  )
}
