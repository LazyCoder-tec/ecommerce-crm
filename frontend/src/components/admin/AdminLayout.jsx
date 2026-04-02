import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children, title, subtitle }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        {(title || subtitle) && (
          <div style={{ marginBottom: 28 }}>
            {title && (
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#042C53', marginBottom: 4 }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p style={{ fontSize: 14, color: '#94A3B8' }}>{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
