import AuthGuard from '@/components/layout/AuthGuard'
import Sidebar from '@/components/layout/Sidebar'

export default function ClientLayout({ children }) {
  return (
    <AuthGuard requiredRole="client">
      <div className="sidebar-layout">
        <Sidebar role="client" />
        <div className="main-content">
          {children}
        </div>
      </div>
    </AuthGuard>
  )
}
