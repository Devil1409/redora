export function StatCard({ icon: Icon, label, value, sub, color = 'indigo' }) {
  const colors = {
    indigo: 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 text-indigo-400',
    cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400',
    emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400',
    rose: 'from-rose-500/20 to-rose-600/5 border-rose-500/20 text-rose-400',
    purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400',
  }

  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${colors[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

export function LoadingSpinner({ size = 'md', text }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} border-2 border-indigo-500 border-t-transparent rounded-full animate-spin`} />
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-800/50 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      {action}
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
