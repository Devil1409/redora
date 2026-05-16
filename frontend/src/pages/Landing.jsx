import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { HiOutlineAcademicCap, HiOutlineLightningBolt, HiOutlineDocumentText, HiOutlineChartBar, HiOutlineShieldCheck, HiOutlineClock } from 'react-icons/hi'

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
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/6 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 lg:px-20 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <HiOutlineAcademicCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">REDORA</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Sign In</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 pt-16 md:pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 animate-fade-in-up">
            <HiOutlineLightningBolt className="w-3.5 h-3.5" />
            Powered by Groq + Hugging Face AI
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Learn Smarter with{' '}
            <span className="gradient-text">AI-Powered</span>{' '}
            Study Tools
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Upload your PDFs, get instant AI summaries, take adaptive quizzes, and track your learning progress — all in one beautiful platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-indigo-500/20 animate-pulse-glow">
              Start Learning Free
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {[['AI Models', '2+'], ['Processing', '<3s'], ['Accuracy', '95%']].map(([label, val]) => (
              <div key={label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{val}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need to Excel</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Powerful AI tools designed to transform how you study and retain knowledge.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-12 lg:px-20 py-20">
        <div className="max-w-3xl mx-auto text-center glass-card p-12 animate-pulse-glow">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-gray-400 mb-8">Join thousands of students who are already learning smarter with REDORA.</p>
          <Link to="/register" className="btn-primary text-base px-10 py-3.5">Get Started Free</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 lg:px-20 py-8 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HiOutlineAcademicCap className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-semibold gradient-text">REDORA</span>
          </div>
          <p className="text-xs text-gray-600">© 2026 REDORA. AI-Powered Smart Learning Assistant.</p>
        </div>
      </footer>
    </div>
  )
}
