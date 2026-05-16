import { HiOutlineMenuAlt2, HiOutlineSearch, HiOutlineBell, HiOutlineUserCircle } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ toggleSidebar }) {
  const { user } = useAuth()

  return (
    <header className="h-[100px] border-b border-white/5 flex items-center justify-between px-8 lg:px-12 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all"
        >
          <HiOutlineMenuAlt2 className="w-6 h-6" />
        </button>
        

      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all group">
          <HiOutlineBell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-[#030408]" />
        </button>
        
        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white leading-none mb-1">{user?.username || 'Student'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Standard Account</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 border border-white/10 flex items-center justify-center cursor-pointer hover:border-indigo-500/50 transition-all">
            <HiOutlineUserCircle className="w-8 h-8 text-slate-300" />
          </div>
        </div>
      </div>
    </header>
  )
}
