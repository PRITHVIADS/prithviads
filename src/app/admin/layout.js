import AuthGuard from '@/components/layout/AuthGuard'
import Sidebar from '@/components/layout/Sidebar'

export default function AdminLayout({ children }) {
  return (
    <AuthGuard requiredRole="admin">
      <div className="sidebar-layout">
        <Sidebar role="admin" />
        <div className="main-content">
          {children}
        </div>
      </div>
    </AuthGuard>
  )
}
