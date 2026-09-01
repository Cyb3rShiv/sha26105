import { CHART } from './chartTheme';

/**
 * Custom recharts tooltip: ink panel, mono values, hairline separators.
 * `formatter` receives (value, name, item) like the stock tooltip.
 */
export default function ChartTooltip({ active, payload, label, formatter, labelFormatter }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="panel px-3 py-2.5 text-xs shadow-xl shadow-black/40 max-w-[280px]"
      style={{ background: CHART.tooltipBg, borderColor: CHART.tooltipBorder }}
    >
      {label !== undefined && label !== '' && (
        <div className="text-[10px] font-mono uppercase tracking-wider text-ink-400 mb-1.5">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((item, idx) => {
          const [displayValue, displayName] = formatter
            ? formatter(item.value, item.name, item)
            : [item.value, item.name];
          return (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-ink-300">
                <span
                  className="w-2 h-2 rounded-[3px] shrink-0"
                  style={{ background: item.color || item.payload?.fill || CHART.brass }}
                />
                {displayName}
              </span>
              <span className="font-mono font-semibold text-ink-50 whitespace-nowrap">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
