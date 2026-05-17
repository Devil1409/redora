import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { HiOutlineCheck, HiOutlineX, HiOutlineTrendingUp, HiOutlineAcademicCap, HiOutlineHome, HiOutlineRefresh, HiOutlineLightBulb } from 'react-icons/hi'
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts'

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()

  const result = state?.result

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-gray-400">No result data found.</p>
        <Link to="/history" className="btn-primary">View History</Link>
      </div>
    )
  }

  const { score, total, percentage, details, weak_topics, strong_topics, time_taken } = result

  const scoreColor = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444'
  const scoreLabel = percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'
  const radialData = [{ name: 'Score', value: percentage, fill: scoreColor }]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Quiz Results</h1>
        <p className="text-gray-400">Here's how you performed</p>
      </div>

      {/* Score Card */}
      <div className="glass-card p-8 mb-8 text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Radial Score */}
          <div className="w-52 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="50%" innerRadius="70%" outerRadius="90%"
                data={radialData} startAngle={90} endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: '#1f2937' }} dataKey="value" angleAxisId={0} data={radialData} cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            {/* Overlay text */}
            <div className="relative -mt-32 flex flex-col items-center justify-center h-24">
              <span className="text-4xl font-black text-white">{Math.round(percentage)}%</span>
              <span className="text-sm font-medium mt-1" style={{ color: scoreColor }}>{scoreLabel}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-4 text-left">
            {[
              { label: 'Correct Answers', value: `${score} / ${total}`, color: 'text-emerald-400' },
              { label: 'Time Taken', value: `${Math.floor(time_taken / 60)}m ${time_taken % 60}s`, color: 'text-cyan-400' },
              { label: 'Weak Topics', value: weak_topics?.length || 0, color: 'text-amber-400' },
              { label: 'Strong Topics', value: strong_topics?.length || 0, color: 'text-indigo-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-current" style={{ color: scoreColor }} />
                <span className="text-sm text-gray-400">{label}:</span>
                <span className={`text-sm font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {weak_topics?.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <HiOutlineLightBulb className="w-4 h-4" /> Areas to Improve
            </h3>
            <div className="flex flex-wrap gap-2">
              {weak_topics.map((t, i) => (
                <span key={i} className="px-3 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">{t}</span>
              ))}
            </div>
          </div>
        )}
        {strong_topics?.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="text-base font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <HiOutlineTrendingUp className="w-4 h-4" /> Strong Areas
            </h3>
            <div className="flex flex-wrap gap-2">
              {strong_topics.map((t, i) => (
                <span key={i} className="px-3 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Question Breakdown */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Question Breakdown</h3>
        <div className="space-y-4">
          {details?.map((d, i) => (
            <div key={i} className={`p-4 rounded-xl border transition-all ${d.is_correct ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${d.is_correct ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {d.is_correct ? <HiOutlineCheck className="w-4 h-4" /> : <HiOutlineX className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 mb-1">{d.question}</p>
                  {!d.is_correct && d.explanation && (
                    <p className="text-xs text-gray-400 mt-2 p-2 rounded-lg bg-gray-800/40">
                      <span className="text-indigo-400 font-medium">Explanation: </span>{d.explanation}
                    </p>
                  )}
                  {d.topic && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded bg-gray-700/50 text-gray-400">{d.topic}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/dashboard" className="btn-secondary">
          <HiOutlineHome className="w-4 h-4" /> Dashboard
        </Link>
        <Link to="/upload" className="btn-secondary">
          <HiOutlineAcademicCap className="w-4 h-4" /> New Study Session
        </Link>
        <button onClick={() => navigate(-2)} className="btn-primary">
          <HiOutlineRefresh className="w-4 h-4" /> Retake Quiz
        </button>
      </div>
    </div>
  )
}
