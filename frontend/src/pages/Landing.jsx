import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { HiOutlineAcademicCap, HiOutlineLightningBolt, HiOutlineDocumentText, HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineClock, HiChevronRight } from 'react-icons/hi'

const features = [
  { icon: HiOutlineDocumentText, title: 'Smart PDF Processing', desc: 'Upload any PDF and our AI extracts, cleans, and structures the content for optimal learning.' },
  { icon: HiOutlineLightningBolt, title: 'AI Summarization', desc: 'Get instant, comprehensive summaries powered by Groq\'s ultra-fast Llama models.' },
  { icon: HiOutlineAcademicCap, title: 'Adaptive Quizzes', desc: 'AI-generated quizzes that adapt difficulty based on your performance and weak areas.' },
  { icon: HiOutlineChartBar, title: 'Performance Analytics', desc: 'Track your progress with detailed charts, topic mastery, and learning trends.' },
  { icon: HiOutlineShieldCheck, title: 'Secure & Private', desc: 'Your data is encrypted and secure with JWT authentication and MongoDB Atlas.' },
  { icon: HiOutlineClock, title: 'Study History', desc: 'Access all your past sessions, summaries, and quiz results anytime.' },
]

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#030408] text-white selection:bg-indigo-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 md:px-16 py-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
            <HiOutlineAcademicCap className="w-6 h-6 text-black" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">REDORA</span>
        </div>
        
        <div className="flex items-center gap-6">
          {user ? (
            <Link to="/dashboard" className="px-6 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-slate-200 transition-all">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="px-6 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-slate-200 transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 md:px-16 pt-20 pb-32 max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter">
            THE FUTURE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 italic">OF STUDYING.</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Redora transforms dense academic PDFs into high-fidelity summaries and adaptive quizzes. Learn faster with AI intelligence.
          </p>

          <div className="flex justify-center pt-4">
            <Link to="/register" className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black text-lg font-black hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
              START NOW
              <HiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Big visual card (Hero Image/Preview) */}
        <div className="mt-24 relative max-w-5xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-[32px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative rounded-[28px] border border-white/10 bg-white/[0.02] backdrop-blur-xl aspect-video overflow-hidden shadow-2xl flex items-center justify-center">
            <div className="text-slate-700 font-black text-4xl uppercase tracking-[0.2em] italic opacity-20 select-none">
              Redora Intelligence
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section - Directly below Hero */}
      <section className="relative z-10 px-8 md:px-16 py-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                <Icon className="w-6 h-6 text-indigo-400 group-hover:text-black transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 md:px-16 py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-50">
          <div className="flex items-center gap-3">
            <HiOutlineAcademicCap className="w-6 h-6" />
            <span className="text-lg font-black uppercase italic tracking-tighter">REDORA</span>
          </div>
          <p className="text-xs font-medium uppercase tracking-widest">© 2026 REDORA. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  )
}

