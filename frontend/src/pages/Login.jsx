import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { HiOutlineLightningBolt, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, login } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill in all fields')
    setLoading(true)
    try {
      const res = await login(email, password)
      if (res.success) {
        toast.success('Welcome back!')
        navigate('/dashboard')
      } else {
        toast.error(res.message || 'Login failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials or network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030408] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl animate-fade-in-up">
        {/* Brand */}
        <div className="text-center mb-16">
          <Link to="/" className="inline-flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-2xl">
              <HiOutlineLightningBolt className="w-8 h-8 text-black" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white italic uppercase">REDORA</span>
          </Link>
          <h2 className="text-4xl font-black text-white mt-12 tracking-tight">Access Archives</h2>
          <p className="text-slate-500 mt-4 text-lg">Continue your high-fidelity study session.</p>
        </div>

        {/* Form Container */}
        <div className="glass-card p-16">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Identification</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@university.edu" 
                  className="w-full bg-transparent border-b border-white/10 py-4 pl-10 outline-none focus:border-white transition-colors text-white text-lg placeholder:text-slate-700 font-medium" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Security Code</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full bg-transparent border-b border-white/10 py-4 pl-10 outline-none focus:border-white transition-colors text-white text-lg placeholder:text-slate-700 font-medium" 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-8">
              {loading ? <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /> : 'Calibrate & Enter'}
            </button>
          </form>

          <div className="mt-12 text-center pt-10 border-t border-white/5">
            <p className="text-slate-500 font-medium">
              New researcher?{' '}
              <Link to="/register" className="text-white hover:underline underline-offset-8 transition-all">Create Profile</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
