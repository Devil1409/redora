import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import API from '../services/api'
import toast from 'react-hot-toast'
import { PageHeader, LoadingSpinner } from '../components/UI'
import { HiOutlineCloudUpload, HiOutlineDocumentText, HiOutlineCheck } from 'react-icons/hi'

export default function Upload() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const navigate = useNavigate()

  const onDrop = useCallback((accepted) => {
    const valid = accepted.filter(f => f.type === 'application/pdf')
    if (valid.length !== accepted.length) {
      toast.error('Only PDF files are allowed')
    }
    if (valid.length > 0) {
      setFiles(prev => [...prev, ...valid].slice(0, 5))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 5,
    maxSize: 50 * 1024 * 1024,
  })

  const handleUpload = async () => {
    if (files.length === 0) return toast.error('Please select at least one PDF file')
    setUploading(true)
    setProgress('Uploading PDFs...')

    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))

      const res = await API.post('/documents/upload_multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      })

      if (res.data.success) {
        if (res.data.documents.length === 1) {
          toast.success(`Processed & Grouped!`)
          navigate(`/summary/${res.data.documents[0].id}`)
        } else {
          toast.success(`Processed! Documents were separated.`)
          navigate(`/history`)
        }
      } else {
        toast.error(res.data.message || 'Upload failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
      setProgress('')
    }
  }

  return (
    <div>
      <PageHeader title="Upload PDF" subtitle="Upload a document to extract text, generate summaries, and create quizzes" />

      <div className="max-w-2xl mx-auto">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`glass-card p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive ? 'border-indigo-500 bg-indigo-500/5' : ''
          } ${files.length > 0 ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}
        >
          <input {...getInputProps()} />

          {files.length > 0 ? (
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                <HiOutlineCheck className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-lg font-semibold text-white">{files.length} File(s) Selected</p>
              {files.map((f, i) => (
                <p key={i} className="text-sm text-gray-400">{f.name} ({(f.size / (1024 * 1024)).toFixed(2)} MB)</p>
              ))}
              <p className="text-xs text-gray-500 mt-4">Click or drag to add more / replace</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-500/15 flex items-center justify-center">
                <HiOutlineCloudUpload className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-lg font-semibold text-white">
                {isDragActive ? 'Drop your PDFs here' : 'Drag & drop your PDFs'}
              </p>
              <p className="text-sm text-gray-400">or click to browse • Max 50 MB total • Similar files will be combined</p>
            </div>
          )}
        </div>

        {/* Upload Button */}
        {uploading ? (
          <div className="mt-8">
            <LoadingSpinner text={progress} />
            <div className="mt-4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full shimmer" style={{ width: '60%' }} />
            </div>
          </div>
        ) : (
          <button onClick={handleUpload} disabled={files.length === 0} className="btn-primary w-full mt-6 justify-center py-3.5 text-base">
            <HiOutlineDocumentText className="w-5 h-5" />
            Upload & Process
          </button>
        )}

        {/* Info */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {[
            { step: '1', label: 'Upload', desc: 'Select your PDF document' },
            { step: '2', label: 'Extract', desc: 'Redora extracts & cleans text' },
            { step: '3', label: 'Learn', desc: 'Get summaries & quizzes' },
          ].map(({ step, label, desc }) => (
            <div key={step} className="flex items-center gap-3 p-4 rounded-xl bg-gray-900/50 border border-gray-800/30">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 font-bold text-sm">{step}</div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
