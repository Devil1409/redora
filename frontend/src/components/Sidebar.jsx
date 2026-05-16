import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HiOutlineViewGrid,
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineLightningBolt
} from 'react-icons/hi'

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const { user, logout } = useAuth()

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
    { to: '/upload', label: 'Synthesize', icon: HiOutlineDocumentText },
    { to: '/history', label: 'Archives', icon: HiOutlineClock },
    { to: '/settings', label: 'Calibrate', icon: HiOutlineCog },
  ]

  return (
    <aside className="h-full glass border-r border-white/5 flex flex-col relative transition-all duration-700">
      {/* Sidebar Toggle - Smaller, Inside, and Darker */}
      <button
        onClick={toggleSidebar}
        className="absolute right-4 top-8 w-8 h-8 rounded-xl bg-white/5 border border-white/5 text-slate-500 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all z-[60]"
      >
        {isCollapsed ? <HiOutlineChevronRight className="w-4 h-4" /> : <HiOutlineChevronLeft className="w-4 h-4" />}
      </button>

      {/* Brand - Fixed Top */}
      <div className={`pt-16 pb-4 transition-all duration-300 ${isCollapsed ? 'px-4 flex justify-center' : 'px-8'}`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-2xl shrink-0">
            <HiOutlineLightningBolt className="w-6 h-6 text-black" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">REDORA</span>
          )}
        </div>
      </div>

      {/* Navigation - Centered Middle */}
      <div className="flex-1 flex flex-col justify-center py-10">
        <nav className={`flex flex-col transition-all duration-500 ${isCollapsed ? 'px-0' : 'px-8'} gap-[60px]`}>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                flex items-center transition-all duration-500 group relative
                ${isActive
                  ? 'bg-white text-black shadow-2xl rounded-[20px]'
                  : 'text-slate-500 hover:text-white hover:bg-white/5 rounded-[20px]'}
                ${isCollapsed ? 'justify-center w-full py-4' : 'gap-5 px-6 py-4'}
              `}
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
              {!isCollapsed && <span className="font-bold text-[13px] tracking-[0.1em] uppercase whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className={`py-16 border-t border-white/5 transition-all duration-300 ${isCollapsed ? 'px-4' : 'px-12'}`}>
        {!isCollapsed && user && (
          <div className="mb-12 flex flex-col gap-3">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Researcher Profile</p>
            <p className="text-base font-bold text-white truncate">{user.username}</p>
          </div>
        )}

        <button
          onClick={logout}
          className={`
            w-full flex items-center gap-8 py-4 rounded-[24px] text-slate-500 hover:text-white transition-all
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <HiOutlineLogout className="w-6 h-6" />
          {!isCollapsed && <span className="font-bold text-[14px] uppercase tracking-[0.1em]">Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
