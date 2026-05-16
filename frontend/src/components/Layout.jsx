import { useState, useEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { HiOutlineHome, HiOutlineDocumentSearch, HiOutlineAcademicCap, HiOutlineClock } from 'react-icons/hi'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()

  // Auto-close sidebar on mobile/tablet when navigating
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false)
    }
  }, [location])

  const mobileNavItems = [
    { icon: HiOutlineHome, path: '/dashboard', label: 'Home' },
    { icon: HiOutlineDocumentSearch, path: '/upload', label: 'Upload' },
    { icon: HiOutlineAcademicCap, path: '/quiz', label: 'Quiz' },
    { icon: HiOutlineClock, path: '/history', label: 'History' },
  ]

  return (
    <div className="flex h-screen w-full bg-[#030408] text-slate-400 overflow-hidden">
      {/* Sidebar - Desktop Only (Hidden on Mobile) */}
      <aside 
        className={`h-full bg-[#030408] border-r border-white/5 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] shrink-0 z-50 overflow-visible hidden lg:block ${
          isSidebarOpen ? 'w-[260px]' : 'w-[64px]'
        }`}
      >
        <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden pb-20 lg:pb-0">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 px-6 md:px-10 lg:px-20 py-10 lg:py-20 w-full">
          <div className="max-w-[1400px] mx-auto animate-fade-in-up">
            <Outlet />
          </div>
        </main>

        <footer className="px-6 lg:px-20 py-12 border-t border-white/5 text-slate-600 text-sm hidden lg:block">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <p>© 2026 REDORA AI. High-fidelity academic synthesis.</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation (Only visible on small screens) */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#05060a]/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-4 z-[100] lg:hidden">
        {mobileNavItems.map(({ icon: Icon, path, label }) => {
          const isActive = location.pathname === path
          return (
            <Link 
              key={path} 
              to={path} 
              className={`flex flex-col items-center gap-1.5 transition-all ${
                isActive ? 'text-white' : 'text-slate-600'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isActive ? 'bg-white text-black shadow-lg shadow-white/20' : 'bg-transparent'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
