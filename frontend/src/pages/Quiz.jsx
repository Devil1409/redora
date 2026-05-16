import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../services/api'
import toast from 'react-hot-toast'
import { LoadingSpinner } from '../components/UI'
import { HiOutlineCheck, HiOutlineClock } from 'react-icons/hi'

export default function Quiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quizzes/${id}`)
        if (res.data.success) setQuiz(res.data.quiz)
        else toast.error('Quiz not found')
      } catch { toast.error('Failed to load quiz') }
      finally { setLoading(false) }
    }
    fetchQuiz()
  }, [id])

  const questions = quiz?.questions || []
  const q = questions[current]
  const totalAnswered = Object.keys(answers).length

  const selectAnswer = (optIdx) => {
    setAnswers(prev => ({ ...prev, [current]: optIdx }))
  }

  const handleSubmit = async () => {
    if (totalAnswered < questions.length) {
      if (!window.confirm(`You answered ${totalAnswered}/${questions.length}. Submit anyway?`)) return
    }
    setSubmitting(true)
    try {
      const formatted = Object.entries(answers).map(([qi, ai]) => ({
        question_index: parseInt(qi),
        selected_answer: ai,
      }))
      const timeTaken = Math.round((Date.now() - startTime) / 1000)
      const res = await API.post(`/quizzes/${id}/submit`, { answers: formatted, time_taken: timeTaken })
      if (res.data.success) {
        toast.success(`Score: ${res.data.result.percentage}%`)
        navigate(`/results/${id}`, { state: { result: res.data.result } })
      }
    } catch { toast.error('Submission failed') }
    finally { setSubmitting(false) }
  }

  if (loading) return <LoadingSpinner size="lg" text="Loading quiz..." />
  if (!q) return <p className="text-gray-400 text-center py-20">No questions available</p>

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Quiz</h1>
          <p className="text-sm text-gray-400 mt-1">Difficulty: <span className="capitalize text-indigo-400">{quiz?.difficulty}</span></p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <HiOutlineClock className="w-4 h-4" />
          {Math.round((Date.now() - startTime) / 1000)}s
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Question {current + 1} of {questions.length}</span>
          <span>{totalAnswered} answered</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card p-8 mb-6 animate-fade-in" key={current}>
        <p className="text-lg font-semibold text-white mb-6 leading-relaxed">{q.question}</p>

        <div className="space-y-3">
          {q.options?.map((opt, i) => {
            const selected = answers[current] === i
            return (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                  selected
                    ? 'border-indigo-500 bg-indigo-500/10 text-white'
                    : 'border-gray-700/40 bg-gray-800/30 text-gray-300 hover:border-gray-600 hover:bg-gray-800/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  selected ? 'bg-indigo-500 text-white' : 'bg-gray-700/50 text-gray-400'
                }`}>
                  {selected ? <HiOutlineCheck className="w-4 h-4" /> : String.fromCharCode(65 + i)}
                </div>
                <span className="text-sm">{opt}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="btn-secondary">Previous</button>

        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                i === current ? 'bg-indigo-500 text-white' :
                answers[i] !== undefined ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                'bg-gray-800/50 text-gray-500 border border-gray-700/30'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {current < questions.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)} className="btn-primary">Next</button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500">
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  )
}
