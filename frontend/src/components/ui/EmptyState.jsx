/**
 * Empty / error state block used when async data is missing
 * (e.g. risk engine unreachable) or a filter returns no rows.
 */
export default function EmptyState({ icon: Icon, title, message, action, tone = 'neutral' }) {
  const toneClass =
    tone === 'danger'
      ? 'text-danger-400 border-danger-800 bg-danger-950/40'
      : 'text-ink-400 border-ink-700 bg-ink-850';

  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && (
        <span className={`flex items-center justify-center w-12 h-12 rounded-xl border mb-4 ${toneClass}`}>
          <Icon className="w-5 h-5" />
        </span>
      )}
      <h3 className="text-sm font-semibold text-ink-100">{title}</h3>
      {message && <p className="text-xs text-ink-400 mt-1.5 max-w-sm leading-relaxed">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
