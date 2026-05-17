import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { HiOutlineLightningBolt, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, login, guestLogin } = useAuth()
  const navigate = useNavigate()

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
    <div className="min-h-screen bg-[#030408] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] animate-fade-in-up">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex flex-col items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform duration-500">
              <HiOutlineLightningBolt className="w-7 h-7 text-black" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white italic uppercase">REDORA</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mt-8 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Please enter your credentials to continue</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-2xl px-6 group focus-within:border-indigo-500/50 focus-within:bg-white/[0.05] transition-all">
                <HiOutlineMail className="w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent px-4 py-3 mt-4 outline-none text-white text-sm placeholder:text-slate-400 rounded-lg border border-slate-700"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-2xl px-6 group focus-within:border-indigo-500/50 focus-within:bg-white/[0.05] transition-all">
                <HiOutlineLockClosed className="w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent px-4 py-3 mt-4 outline-none text-white text-sm placeholder:text-slate-400 rounded-lg border border-slate-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 mt-4 rounded-2xl bg-white text-black text-sm font-bold hover:bg-slate-100 hover:shadow-[0_10px_30px_-5px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all duration-300 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                'Sign In'
              )}
            </button>

            <button
              type="button"
              onClick={async () => {
                setLoading(true)
                try {
                  const res = await guestLogin()
                  if (res.success) {
                    toast.success('Logged in as Guest')
                    navigate('/dashboard')
                  }
                } catch (err) { toast.error('Guest login failed') }
                finally { setLoading(false) }
              }}
              disabled={loading}
              className="w-full h-14 mt-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 active:scale-[0.98] transition-all duration-300 disabled:opacity-70"
            >
              Continue as Guest
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-slate-500 text-sm font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:text-indigo-400 transition-colors font-bold">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

