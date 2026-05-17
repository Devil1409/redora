import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../services/api'
import toast from 'react-hot-toast'
import { PageHeader, LoadingSpinner } from '../components/UI'
import { HiOutlineUser, HiOutlineCog, HiOutlineShieldCheck, HiOutlineBell, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi'

export default function Settings() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    difficulty_preference: 'auto',
    dark_mode: true
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await API.get('/auth/profile')
      if (res.data.success) {
        const u = res.data.user
        setProfile(u)
        setFormData({
          username: u.username || '',
          bio: u.profile?.bio || '',
          difficulty_preference: u.settings?.difficulty_preference || 'auto',
          dark_mode: u.settings?.dark_mode ?? true
        })
      }
    } catch (err) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)
    try {
      const res = await API.put('/auth/profile', {
        username: formData.username,
        bio: formData.bio,
        settings: {
          difficulty_preference: formData.difficulty_preference,
          dark_mode: formData.dark_mode
        }
      })
      if (res.data.success) {
        toast.success('Profile updated successfully')
        // Update local state if needed
      }
    } catch (err) {
      toast.error('Update failed')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" text="Loading settings..." />

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account preferences and learning settings" />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <h3 className="text-xl font-bold text-white">{user?.username}</h3>
            <p className="text-sm text-gray-500 mb-6">{user?.email}</p>
            <button onClick={logout} className="btn-secondary w-full justify-center text-red-400 border-red-500/20 hover:bg-red-500/10">
              Sign Out
            </button>
          </div>

          <div className="glass-card p-6">
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <HiOutlineShieldCheck className="w-4 h-4 text-emerald-400" /> Account Security
            </h4>
            <button className="w-full text-left p-3 rounded-xl bg-gray-800/30 border border-gray-700/30 text-sm text-gray-300 hover:bg-gray-800/50 transition-all">
              Change Password
            </button>
          </div>
        </div>

        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <HiOutlineUser className="w-5 h-5 text-indigo-400" /> Personal Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="input-field opacity-50 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Bio</label>
                  <textarea
                    rows="3"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="input-field"
                    placeholder="Tell us about your learning goals..."
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-800/60">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <HiOutlineCog className="w-5 h-5 text-indigo-400" /> Learning Preferences
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Quiz Difficulty</label>
                    <select
                      value={formData.difficulty_preference}
                      onChange={(e) => setFormData({ ...formData, difficulty_preference: e.target.value })}
                      className="input-field bg-gray-900"
                    >
                      <option value="auto">Adaptive (Redora Recommended)</option>
                      <option value="easy">Easy (Fundamentals)</option>
                      <option value="medium">Medium (Standard)</option>
                      <option value="hard">Hard (Advanced)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-800/60 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <HiOutlineMoon className="w-5 h-5 text-indigo-400" /> Dark Mode
                  </h3>
                  <p className="text-sm text-gray-500">Enable premium dark aesthetics</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, dark_mode: !formData.dark_mode })}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${formData.dark_mode ? 'bg-indigo-600' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${formData.dark_mode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="pt-6">
                <button type="submit" disabled={updating} className="btn-primary w-full md:w-auto px-8">
                  {updating ? 'Saving Changes...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
