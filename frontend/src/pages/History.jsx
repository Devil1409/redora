import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import toast from 'react-hot-toast'
import { PageHeader, LoadingSpinner, EmptyState } from '../components/UI'
import { HiOutlineClock, HiOutlineDocumentText, HiOutlineAcademicCap, HiOutlineTrash } from 'react-icons/hi'

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchHistory() }, [])

  const fetchHistory = async () => {
    try {
      const res = await API.get('/history/')
      if (res.data.success) setHistory(res.data.history)
    } catch { toast.error('Failed to load history') }
    finally { setLoading(false) }
  }

  const handleClear = async () => {
    if (!window.confirm('Clear all history? This cannot be undone.')) return
    try {
      await API.delete('/history/clear')
      setHistory([])
      toast.success('History cleared')
    } catch { toast.error('Failed to clear history') }
  }

  const filtered = filter === 'all' ? history : history.filter(h => h.type === filter)

  const getStatusColor = (item) => {
    if (item.type === 'quiz') {
      const pct = item.total ? (item.score / item.total) * 100 : 0
      return pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400'
    }
    return item.status === 'completed' ? 'text-emerald-400' : item.status === 'processing' ? 'text-amber-400' : 'text-gray-400'
  }

  if (loading) return <LoadingSpinner size="lg" text="Loading history..." />

  return (
    <div>
      <PageHeader
        title="Study History"
        subtitle="All your documents and quiz sessions"
        action={
          history.length > 0 && (
            <button onClick={handleClear} className="btn-secondary text-red-400 hover:text-red-300 hover:border-red-500/30">
              <HiOutlineTrash className="w-4 h-4" /> Clear All
            </button>
          )
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[['all', 'All'], ['document', 'Documents'], ['quiz', 'Quizzes']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === val
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25'
                : 'text-gray-400 hover:text-white bg-gray-800/30 border border-gray-700/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={HiOutlineClock}
          title="No history yet"
          description="Upload a PDF or take a quiz to get started."
          action={<Link to="/upload" className="btn-primary">Upload PDF</Link>}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <div key={i} className="glass-card p-5 flex items-center gap-4">
              {/* Icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                item.type === 'document'
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'bg-cyan-500/15 text-cyan-400'
              }`}>
                {item.type === 'document'
                  ? <HiOutlineDocumentText className="w-5 h-5" />
                  : <HiOutlineAcademicCap className="w-5 h-5" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs font-medium ${getStatusColor(item)}`}>
                    {item.type === 'quiz' && item.score !== null
                      ? `${item.score}/${item.total} (${Math.round((item.score / item.total) * 100)}%)`
                      : item.status}
                  </span>
                  <span className="text-xs text-gray-600">
                    {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                {item.type === 'document' && item.status === 'completed' && (
                  <Link to={`/summary/${item.id}`} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all">
                    View Summary
                  </Link>
                )}
                {item.type === 'quiz' && item.status === 'completed' && (
                  <span className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-700/40 text-gray-400 border border-gray-600/30">
                    Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
