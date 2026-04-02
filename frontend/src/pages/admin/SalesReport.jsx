import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { adminAPI } from '../../services/api'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { FiDollarSign, FiShoppingCart, FiTrendingUp } from 'react-icons/fi'

export default function SalesReport() {
  const [orders, setOrders]   = useState([])
  const [daily,  setDaily]    = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    Promise.all([adminAPI.getAllSales(), adminAPI.getDailySales()])
      .then(([oRes, dRes]) => { setOrders(oRes.data); setDaily(dRes.data) })
      .catch(() => toast.error('Failed to load sales data'))
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue  = orders.reduce((s, o) => s + (o.amount || 0), 0)
  const totalOrders   = orders.length
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0

  const filtered = orders.filter(o =>
    o.userName?.toLowerCase().includes(search.toLowerCase()) ||
    o.courseTitle?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <AdminLayout title="Sales Report"><div className="page-loader"><div className="spinner" /></div></AdminLayout>

  return (
    <AdminLayout title="Sales Report" subtitle="Track revenue and course purchase analytics">

      {/* Stat cards */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        {[
          { icon: FiShoppingCart, label: 'Total Orders',    value: totalOrders,                        color: '#378ADD', bg: '#E6F1FB' },
          { icon: FiDollarSign,   label: 'Total Revenue',   value: `₹${totalRevenue.toLocaleString()}`, color: '#16A34A', bg: '#F0FDF4' },
          { icon: FiTrendingUp,   label: 'Avg Order Value', value: `₹${Math.round(avgOrderValue).toLocaleString()}`, color: '#D97706', bg: '#FFFBEB' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} style={{
            background: 'white', borderRadius: 14, padding: '20px 22px',
            border: '1px solid #E2E8F0', display: 'flex', gap: 16, alignItems: 'center'
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#042C53' }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: 'white', borderRadius: 14, padding: '22px 24px', border: '1px solid #E2E8F0', marginBottom: 28 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#042C53', marginBottom: 20 }}>Revenue — Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={daily} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <Tooltip formatter={(v, n) => n === 'revenue' ? `₹${v.toLocaleString()}` : v} />
            <Bar dataKey="revenue" fill="#185FA5" radius={[6,6,0,0]} name="Revenue (₹)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Orders table */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#042C53' }}>All Transactions</h3>
          <input className="form-input" style={{ width: 240 }} placeholder="Search orders…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="table-wrap" style={{ borderRadius: 0, border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Course</th>
                <th>Payment ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id}>
                  <td style={{ color: '#94A3B8', fontSize: 12 }}>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#042C53' }}>{o.userName}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{o.userEmail}</div>
                  </td>
                  <td style={{ fontSize: 13, maxWidth: 180 }}>
                    <div style={{ fontWeight: 500, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {o.courseTitle}
                    </div>
                  </td>
                  <td style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>
                    {o.paymentIntentId ? o.paymentIntentId.slice(0, 20) + '…' : '—'}
                  </td>
                  <td style={{ fontWeight: 700, color: '#16A34A' }}>₹{o.amount?.toLocaleString()}</td>
                  <td style={{ fontSize: 12, color: '#94A3B8' }}>
                    {o.purchasedAt ? new Date(o.purchasedAt).toLocaleDateString() : '—'}
                  </td>
                  <td><span className="badge badge-green">SUCCESS</span></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
