import Reveal from './Reveal';

/**
 * Consistent page masthead: eyebrow, serif title, description, actions.
 */
export default function PageHeader({ icon: Icon, eyebrow, title, description, actions }) {
  return (
    <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-ink-850 border border-ink-700 text-brass-400 shrink-0">
              <Icon className="w-[18px] h-[18px]" />
            </span>
          )}
          <h1 className="font-display text-[24px] md:text-[28px] leading-tight font-medium text-ink-50">
            {title}
          </h1>
        </div>
        {description && (
          <p className="text-[12.5px] text-ink-300 mt-2.5 max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </Reveal>
  );
}
