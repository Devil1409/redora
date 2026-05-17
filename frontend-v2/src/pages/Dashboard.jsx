import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import { StatCard, LoadingSpinner, PageHeader } from '../components/UI'
import { HiOutlineDocumentText, HiOutlineAcademicCap, HiOutlineTrendingUp, HiOutlineFire, HiOutlineCloudUpload, HiOutlineArrowRight } from 'react-icons/hi'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Clear old data first to force a visual "Fresh" state
    setData(null)
    setLoading(true)
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      await new Promise(r => setTimeout(r, 500))
      const res = await API.get('/analytics/dashboard')
      console.log("📊 DASHBOARD DATA RECEIVED:", res.data)
      if (res.data.success) {
        // Ensure we grab the nested dashboard object correctly
        const dashboardData = res.data.dashboard || {}
        setData(dashboardData)
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" text="Loading dashboard..." />

  // Robustly extract stats from the data state
  const stats = data?.stats || {}
  const weekly = data?.weekly_scores || []
  const topics = data?.topic_mastery || []
  const activity = data?.recent_activity || {}

  return (
    <div className="space-y-24">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back. Here is your academic progress."
        action={
          <Link to="/upload" className="btn-primary">
            <HiOutlineCloudUpload /> Upload PDF
          </Link>
        }
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <StatCard icon={HiOutlineDocumentText} label="Documents" value={stats.total_documents || 0} color="indigo" />
        <StatCard icon={HiOutlineAcademicCap} label="Quizzes Taken" value={stats.completed_quizzes || 0} color="cyan" />
        <StatCard icon={HiOutlineTrendingUp} label="Avg Score" value={`${stats.average_score || 0}%`} color="emerald" />
        <StatCard icon={HiOutlineFire} label="Study Streak" value={stats.study_streak || 0} sub="days" color="amber" />
      </div>

      {/* Charts Section */}
      <section className="space-y-16">
        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold text-white tracking-tight">Performance Metrics</h3>
          <p className="text-slate-500 max-w-2xl">Quantitative analysis of your weekly study patterns and topic-specific mastery levels.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Weekly Score Trend */}
          <div className="glass-card">
            <h4 className="text-lg font-bold text-white mb-12">Weekly Score Progression</h4>
            {weekly.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={weekly}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fff" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                  <XAxis dataKey="day" stroke="#475569" fontSize={12} axisLine={false} tickLine={false} tick={{dy: 10}} />
                  <YAxis stroke="#475569" fontSize={12} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#030408', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '16px' }} />
                  <Area type="monotone" dataKey="score" stroke="#fff" fillOpacity={1} fill="url(#scoreGrad)" strokeWidth={4} connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-600 text-center py-32">No session data available yet.</p>
            )}
          </div>

          {/* Topic Mastery */}
          <div className="glass-card">
            <h4 className="text-lg font-bold text-white mb-12">Subject Mastery Breakdown</h4>
            {topics.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={topics.slice(0, 6)} layout="vertical" barGap={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="topic" stroke="#475569" fontSize={12} width={140} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#030408', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }} />
                  <Bar dataKey="mastery" fill="rgba(255,255,255,0.1)" radius={[0, 12, 12, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-600 text-center py-32">Complete quizzes to analyze mastery.</p>
            )}
          </div>
        </div>
      </section>

      {/* Shortcuts */}
      <section className="space-y-12">
        <h3 className="text-2xl font-bold text-white tracking-tight text-center">Ready to dive in?</h3>
        <div className="grid sm:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            { to: '/upload', label: 'Synthesize', desc: 'Process new documents', icon: HiOutlineCloudUpload },
            { to: '/history', label: 'Retrieve', desc: 'Access your archives', icon: HiOutlineDocumentText },
            { to: '/settings', label: 'Calibrate', desc: 'Adjust your preferences', icon: HiOutlineTrendingUp },
          ].map(({ to, label, desc, icon: Icon }) => (
            <Link key={to} to={to} className="flex flex-col items-center text-center gap-6 p-12 glass-card group">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                <Icon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-white">{label}</p>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
