import { AdminSidebar } from './AdminSidebar'

export function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-72 pt-32 lg:pt-0 pb-20">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
