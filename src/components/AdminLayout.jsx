import { AdminSidebar } from './AdminSidebar'

export function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-72 pt-32 lg:pt-0 pb-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {children}
        </div>
      </main>
    </div>
  )
}
