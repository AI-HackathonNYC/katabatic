import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'

interface Props {
  lastUpdated: Date | null
}

export function DashboardLayout({ lastUpdated }: Props) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#555] font-sans">
      <Header lastUpdated={lastUpdated} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
