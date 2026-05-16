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
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-indigo-500/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-cyan-500/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Modern Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 md:px-16 lg:px-24 py-8 backdrop-blur-sm border-b border-white/5 sticky top-0">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-transform group-hover:scale-110">
            <HiOutlineAcademicCap className="w-7 h-7 text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">REDORA</span>
        </div>
        
        <div className="flex items-center gap-6">
          {user ? (
            <Link to="/dashboard" className="px-8 py-3 rounded-2xl bg-white text-black font-bold hover:bg-slate-200 transition-all">
              Launch Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="px-8 py-3 rounded-2xl bg-white text-black font-bold hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Wide Hero Section */}
      <section className="relative z-10 px-8 md:px-16 lg:px-24 pt-32 pb-48">
        <div className="max-w-[1600px] mx-auto">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold mb-12 tracking-widest uppercase animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Adaptive AI Engine Live
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black leading-[0.9] tracking-tighter mb-10 animate-fade-in-up">
                THE FUTURE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">OF STUDYING.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-400 max-w-xl mb-14 leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Redora transforms dense academic PDFs into high-fidelity summaries and adaptive quizzes. Learn 5x faster with Groq-powered intelligence.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Link to="/register" className="group flex items-center gap-3 px-10 py-5 rounded-[24px] bg-white text-black text-lg font-black hover:scale-105 transition-all shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)]">
                  START LEARNING FREE
                  <HiChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`w-12 h-12 rounded-full border-2 border-[#030408] bg-slate-800 flex items-center justify-center text-[10px] font-bold`}>
                      U{i}
                    </div>
                  ))}
                  <div className="pl-6 text-sm text-slate-500 font-bold">Joined by 2k+ Students</div>
                </div>
              </div>
            </div>

            <div className="relative group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-[40px] blur-2xl group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl aspect-video overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="flex items-center justify-center h-full text-slate-600 font-black text-3xl uppercase tracking-widest italic opacity-20">
                  Dashboard Preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Features */}
      <section className="relative z-10 px-8 md:px-16 lg:px-24 py-40 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-32">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">BUILT FOR PERFORMANCE.</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-cyan-500" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-white group-hover:scale-110 transition-all duration-500">
                  <Icon className="w-8 h-8 text-indigo-400 group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
                <p className="text-lg text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra-Airy CTA */}
      <section className="relative z-10 px-8 md:px-16 lg:px-24 py-64">
        <div className="max-w-[1600px] mx-auto text-center">
          <h2 className="text-6xl md:text-[100px] font-black tracking-tighter mb-16 leading-none">
            READY TO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 italic">ELEVATE?</span>
          </h2>
          <Link to="/register" className="inline-block px-16 py-6 rounded-[32px] bg-white text-black text-2xl font-black hover:scale-105 transition-all shadow-[0_30px_100px_-20px_rgba(255,255,255,0.4)]">
            CREATE ACCOUNT
          </Link>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="relative z-10 px-8 md:px-16 lg:px-24 py-20 border-t border-white/5">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-4">
            <HiOutlineAcademicCap className="w-8 h-8 text-white" />
            <span className="text-xl font-black uppercase italic tracking-tighter">REDORA</span>
          </div>
          <div className="flex gap-16 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <p className="text-sm text-slate-700 font-medium">© 2026 REDORA. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  )
}
