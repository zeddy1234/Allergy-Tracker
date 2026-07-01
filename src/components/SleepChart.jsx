import { useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useTheme } from '../lib/theme'

const SLEEP_COLOR_LIGHT = '#3C5A8A'
const SLEEP_COLOR_DARK = '#9AB4F0'

function shortDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function SleepTooltip({ active, payload, label, color }) {
  if (!active || !payload || payload.length === 0) return null
  const val = payload[0].value
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__date">{shortDate(label)}</div>
      <div className="chart-tooltip__row">
        <span className="chart-tooltip__dot" style={{ background: color }} />
        <span className="chart-tooltip__name">Sleep</span>
        <span className="chart-tooltip__value">
          {val == null ? '—' : `${Math.round(val * 10) / 10}h`}
        </span>
      </div>
    </div>
  )
}

export default function SleepChart({ entries, rangeDays }) {
  const theme = useTheme()
  const color = theme === 'dark' ? SLEEP_COLOR_DARK : SLEEP_COLOR_LIGHT

  const { data, average, hasData } = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - rangeDays)
    const cutoffStr = cutoff.toISOString().slice(0, 10)

    const filtered = entries
      .filter((e) => e.entry_date >= cutoffStr)
      .map((e) => ({ date: e.entry_date, hours: e.sleep_hours ?? null }))

    const logged = filtered.filter((d) => d.hours != null)
    const avg =
      logged.length > 0
        ? logged.reduce((sum, d) => sum + d.hours, 0) / logged.length
        : null

    return { data: filtered, average: avg, hasData: logged.length > 0 }
  }, [entries, rangeDays])

  return (
    <section className="entry-card">
      <div className="trend-header">
        <h2 className="entry-card__title">Sleep</h2>
        {average !== null && (
          <span className="sleep-average">Avg {average.toFixed(1)}h</span>
        )}
      </div>

      {!hasData ? (
        <p className="empty-state__sub">No sleep logged in this range.</p>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -4, bottom: 0 }}>
              <defs>
                <linearGradient id="sleepFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-line-soft)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={shortDate}
                tick={{ fontSize: 11, fill: 'var(--color-ink-soft)' }}
                axisLine={{ stroke: 'var(--color-line)' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 12]}
                ticks={[0, 3, 6, 9, 12]}
                tickFormatter={(v) => `${v}h`}
                tick={{ fontSize: 11, fill: 'var(--color-ink-soft)' }}
                axisLine={false}
                tickLine={false}
                width={34}
              />
              <Tooltip content={<SleepTooltip color={color} />} />
              <Area
                type="monotone"
                dataKey="hours"
                stroke={color}
                strokeWidth={2.5}
                fill="url(#sleepFill)"
                dot={{ r: 3, fill: color }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
