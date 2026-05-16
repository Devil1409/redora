import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const location = useLocation()

  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false)
    }
  }, [location])

  return (
    <div className="flex h-screen w-full bg-[#030408] text-slate-400 overflow-hidden">
      {/* Sidebar - Fixed Height, No Scroll */}
      <aside 
        className={`h-full bg-[#030408] border-r border-white/5 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] shrink-0 z-50 overflow-visible ${
          isSidebarOpen ? 'w-[260px]' : 'w-[64px]'
        }`}
      >
        <Sidebar isCollapsed={!isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </aside>

      {/* Main Content Area - Its own scrollable container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 px-10 lg:px-20 py-20 w-full">
          <div className="max-w-[1400px] mx-auto animate-fade-in-up">
            <Outlet />
          </div>
        </main>

        <footer className="px-10 lg:px-20 py-12 border-t border-white/5 text-slate-600 text-sm">
          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <p>© 2026 REDORA AI. High-fidelity academic synthesis.</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Overlay */}
      {window.innerWidth < 1024 && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
