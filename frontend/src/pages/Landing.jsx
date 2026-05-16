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
    <div className="min-h-screen bg-[#030408] text-white selection:bg-indigo-500/30 flex flex-col items-center">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-indigo-500/5 rounded-full blur-[160px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between w-full max-w-7xl px-8 md:px-16 py-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <HiOutlineAcademicCap className="w-7 h-7 text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">REDORA</span>
        </div>

        <div className="flex items-center gap-8">
          {user ? (
            <Link to="/dashboard" className="px-10 py-4 rounded-2xl bg-transparent border border-white/20 text-white text-sm font-extrabold hover:bg-white hover:text-black hover:border-white transition-all">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Sign In</Link>
              <Link to="/register" className="px-10 py-4 rounded-2xl bg-transparent border border-white/20 text-white text-sm font-extrabold hover:bg-white hover:text-black hover:border-white transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-7xl px-8 md:px-16 pt-32 pb-48 flex flex-col items-center text-center">
        {/* Title with Background and Reflection */}
        <div className="relative mb-40">
          {/* Title Background Image */}
          <div className="absolute inset-0 -inset-x-20 -inset-y-10 pointer-events-none opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop" 
              alt="Background" 
              className="w-full h-full object-cover rounded-full blur-3xl"
            />
          </div>
          
          <h1 
            className="relative text-6xl md:text-[140px] font-black leading-none tracking-tighter"
            style={{ 
              WebkitBoxReflect: 'below -20px linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.15))' 
            }}
          >
            REDORA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 italic">OF STUDYING.</span>
          </h1>
        </div>
        
        {/* Description and Button - Moved down to clear reflection */}
        <div className="space-y-12 max-w-4xl pt-10">
          <p className="text-xl md:text-2xl text-slate-400 max-w-5xl mx-auto leading-relaxed font-medium">
            AI Smart Learning Assistant with Summarization and Quiz Generation.<br />
            Learn faster with AI intelligence.
          </p>

          <div className="flex justify-center pt-8">
            <Link to="/register" className="group flex items-center gap-4 px-14 py-6 rounded-[24px] bg-transparent border border-white/20 text-white text-xl font-black hover:bg-white hover:text-black hover:border-white transition-all shadow-2xl">
              START NOW
              <HiChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Big visual card (Hero Image/Preview) */}
        <div className="mt-40 relative w-full max-w-5xl group">
          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative rounded-[32px] border border-white/10 bg-white/[0.02] backdrop-blur-3xl aspect-video overflow-hidden shadow-2xl flex items-center justify-center">
            <div className="text-slate-700 font-black text-5xl uppercase tracking-[0.3em] italic opacity-10 select-none">
              Redora Intelligence
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="relative z-10 w-full max-w-7xl px-8 md:px-16 py-40">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-10 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                <Icon className="w-7 h-7 text-indigo-400 group-hover:text-black transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
              <p className="text-slate-500 leading-relaxed text-base">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl px-8 md:px-16 mt-64 py-20 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 opacity-30">
          <div className="flex items-center gap-4">
            <HiOutlineAcademicCap className="w-8 h-8" />
            <span className="text-2xl font-black uppercase italic tracking-tighter">REDORA</span>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em]">© 2026 REDORA. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  )
}
