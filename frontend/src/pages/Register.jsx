import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { HiOutlineAcademicCap, HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !email || !password) return toast.error('Please fill in all fields')
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const res = await register(username, email, password)
      if (res.success) {
        toast.success('Account created successfully!')
        navigate('/dashboard')
      } else {
        toast.error(res.message || 'Registration failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030408] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-[600px] animate-fade-in-up">
        {/* Brand Header */}
        <div className="text-center mb-16">
          <Link to="/" className="inline-flex flex-col items-center gap-6 group">
            <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">
              <HiOutlineAcademicCap className="w-8 h-8 text-black" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white italic uppercase">REDORA</span>
          </Link>
          <h2 className="text-5xl font-black text-white mt-12 tracking-tight">CREATE PROFILE.</h2>
          <p className="text-slate-500 mt-6 text-xl font-medium tracking-wide">Join the future of high-speed learning.</p>
        </div>

        {/* Airy Form Container */}
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-16 md:p-20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-600" />
                <input 
                  type="text" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  placeholder="John Doe" 
                  className="w-full bg-transparent border-b border-white/10 py-5 pl-12 outline-none focus:border-white transition-all text-white text-xl placeholder:text-slate-800" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Academic Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-600" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@university.edu" 
                  className="w-full bg-transparent border-b border-white/10 py-5 pl-12 outline-none focus:border-white transition-all text-white text-xl placeholder:text-slate-800" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Security Protocol</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-0 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-600" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Min. 6 characters" 
                  className="w-full bg-transparent border-b border-white/10 py-5 pl-12 outline-none focus:border-white transition-all text-white text-xl placeholder:text-slate-800" 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full h-20 rounded-[24px] bg-white text-black text-xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)]">
              {loading ? (
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                'ESTABLISH PROFILE'
              )}
            </button>
          </form>

          <div className="mt-16 text-center pt-10 border-t border-white/5">
            <p className="text-slate-500 text-lg font-medium">
              Existing researcher?{' '}
              <Link to="/login" className="text-white hover:text-indigo-400 transition-colors underline underline-offset-[12px] decoration-white/20 hover:decoration-indigo-400/50">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
