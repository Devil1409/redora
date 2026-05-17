import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../services/api'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { PageHeader, LoadingSpinner } from '../components/UI'
import { HiOutlineAcademicCap, HiOutlineRefresh, HiOutlineClipboardCopy, HiOutlineTag, HiOutlineLightningBolt } from 'react-icons/hi'

export default function Summary() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doc, setDoc] = useState(null)
  const [loading, setLoading] = useState(true)
  const [streaming, setStreaming] = useState(false)
  const [streamedSummary, setStreamedSummary] = useState('')
  const eventSourceRef = useRef(null)

  useEffect(() => {
    fetchDocument()
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close()
    }
  }, [id])

  const fetchDocument = async () => {
    try {
      const res = await API.get(`/documents/${id}`)
      if (res.data.success) {
        setDoc(res.data.document)
        if (!res.data.document.summary) {
          startStreaming('detailed')
        } else {
          setStreamedSummary(res.data.document.summary)
        }
      }
    } catch { toast.error('Failed to load document') }
    finally { setLoading(false) }
  }

  const startStreaming = (style) => {
    if (eventSourceRef.current) eventSourceRef.current.close()
    
    setStreaming(true)
    setStreamedSummary('')
    
    const token = localStorage.getItem('redora_token')
    const baseUrl = import.meta.env.VITE_API_URL || '/api'
    
    // Using native EventSource for SSE
    // Note: EventSource doesn't support headers, so we pass token in URL or use a custom polyfill/fetch
    // Here we'll use a fetch-based stream for better header support
    const fetchStream = async () => {
      try {
        const response = await fetch(`${baseUrl}/documents/${id}/stream-summarize?style=${style}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        
        while (true) {
          const { value, done } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim()
              if (dataStr === '[DONE]') {
                setStreaming(false)
                continue
              }
              
              try {
                const data = JSON.parse(dataStr)
                if (data.topics) {
                  setDoc(prev => ({ ...prev, key_topics: data.topics }))
                }
                if (data.chunk) {
                  setStreamedSummary(prev => prev + data.chunk)
                }
              } catch (e) { /* ignore partial json */ }
            }
          }
        }
      } catch (err) {
        toast.error('Streaming interrupted')
        setStreaming(false)
      }
    }
    
    fetchStream()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(streamedSummary)
    toast.success('Copied to clipboard')
  }

  const handleGenerateQuiz = async () => {
    try {
      const res = await API.post('/quizzes/generate', { document_id: id, num_questions: 5, difficulty: 'auto' })
      if (res.data.success) {
        toast.success('Quiz generated!')
        navigate(`/quiz/${res.data.quiz.id}`)
      }
    } catch { toast.error('Quiz generation failed') }
  }

  if (loading) return <LoadingSpinner size="lg" text="Loading document..." />

  return (
    <div>
      <PageHeader
        title={doc?.filename || 'Document'}
        subtitle={`${doc?.page_count || 0} pages • Processing with Redora`}
        action={
          <div className="flex gap-3">
            <button onClick={handleCopy} className="btn-secondary"><HiOutlineClipboardCopy className="w-4 h-4" /> Copy</button>
            <button onClick={handleGenerateQuiz} disabled={streaming} className="btn-primary"><HiOutlineAcademicCap className="w-4 h-4" /> Generate Quiz</button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-xl">
                  <HiOutlineLightningBolt className={`w-6 h-6 ${streaming ? 'text-amber-500 animate-pulse' : 'text-black'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Redora Synthesis</h3>
                  {streaming && <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mt-1">Generating Response...</p>}
                </div>
              </div>
              <div className="flex gap-4">
                {['detailed', 'concise'].map(style => (
                  <button key={style} onClick={() => startStreaming(style)} disabled={streaming} className="px-6 py-2 text-sm font-bold rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all capitalize border border-white/5">
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {!streamedSummary && (
            <div className="glass-card p-12 min-h-[400px] flex flex-col items-center justify-center text-slate-600">
              <div className="w-16 h-16 border-4 border-white/5 border-t-white rounded-full animate-spin mb-8" />
              <p className="text-lg font-medium">Initializing Redora Engine...</p>
            </div>
          )}

          {streamedSummary && streamedSummary.split(/(?=\n###? )/).map((section, idx, arr) => (
            <div key={idx} className="glass-card p-8 markdown-content max-w-none">
              <ReactMarkdown>{section}</ReactMarkdown>
              {streaming && idx === arr.length - 1 && (
                <span className="inline-block w-3 h-6 bg-white ml-2 animate-pulse align-middle" />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-12">
          <div className="glass-card p-10">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <HiOutlineTag className="w-5 h-5" /> Semantic Anchors
            </h3>
            <div className="flex flex-wrap gap-3">
              {doc?.key_topics?.map((topic, i) => (
                <span key={i} className="px-4 py-2 text-xs font-bold rounded-xl bg-white/5 text-slate-300 border border-white/5 animate-fade-in">{topic}</span>
              )) || <p className="text-sm text-slate-600 italic">Extracting tokens...</p>}
            </div>
          </div>

          <div className="glass-card p-10 border-l-4 border-l-indigo-500/50">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4">System Status</h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              Utilizing Redora's advanced models to generate highly accurate and stable summaries.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <span className="text-xs text-emerald-500 font-black uppercase tracking-widest">Online</span>
            </div>
          </div>

          <button onClick={handleGenerateQuiz} disabled={streaming} className="btn-primary w-full justify-center group">
            <HiOutlineAcademicCap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Generate Adaptive Quiz</span>
          </button>
        </div>
      </div>
    </div>
  )
}
