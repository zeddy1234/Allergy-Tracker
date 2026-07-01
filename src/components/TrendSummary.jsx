import { useMemo, useState } from 'react'
import { useTheme } from '../lib/theme'

const SEVERITY_VALUE = { none: 0, mild: 1, severe: 2 }

function toDateOnly(d) {
  return d.toISOString().slice(0, 10)
}

function averageSeverity(entries, symptomName, startStr, endStr) {
  let sum = 0
  let count = 0
  entries.forEach((e) => {
    if (e.entry_date < startStr || e.entry_date > endStr) return
    const found = (e.symptoms || []).find((s) => s.name === symptomName)
    if (found) {
      sum += SEVERITY_VALUE[found.severity]
      count += 1
    }
  })
  if (count === 0) return null
  return sum / count
}

function directionFor(pct) {
  if (pct === null) return 'unknown'
  if (pct > 5) return 'worsening'
  if (pct < -5) return 'improving'
  return 'stable'
}

const DIRECTION_META_LIGHT = {
  worsening: { label: 'Worsening', color: '#C0392B' },
  improving: { label: 'Improving', color: '#1D6B4A' },
  stable: { label: 'Stable', color: '#8A6D00' },
  unknown: { label: 'Not enough data', color: '#B4AE9F' },
}

const DIRECTION_META_DARK = {
  worsening: { label: 'Worsening', color: '#FF6B5B' },
  improving: { label: 'Improving', color: '#5FD69A' },
  stable: { label: 'Stable', color: '#F0D061' },
  unknown: { label: 'Not enough data', color: '#6B6559' },
}

function Arrow({ direction }) {
  if (direction === 'worsening') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 5L8 11L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 8 8)" />
      </svg>
    )
  }
  if (direction === 'improving') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 5L8 11L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (direction === 'stable') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  return null
}

export default function TrendSummary({ entries, symptomNames, colorByName }) {
  const theme = useTheme()
  const DIRECTION_META = theme === 'dark' ? DIRECTION_META_DARK : DIRECTION_META_LIGHT
  const [period, setPeriod] = useState('week') // 'week' | 'month'

  const rows = useMemo(() => {
    const periodDays = period === 'week' ? 7 : 30

    const today = new Date()
    const currentEnd = toDateOnly(today)
    const currentStartDate = new Date(today)
    currentStartDate.setDate(currentStartDate.getDate() - (periodDays - 1))
    const currentStart = toDateOnly(currentStartDate)

    const previousEndDate = new Date(currentStartDate)
    previousEndDate.setDate(previousEndDate.getDate() - 1)
    const previousEnd = toDateOnly(previousEndDate)
    const previousStartDate = new Date(previousEndDate)
    previousStartDate.setDate(previousStartDate.getDate() - (periodDays - 1))
    const previousStart = toDateOnly(previousStartDate)

    return symptomNames.map((name) => {
      const current = averageSeverity(entries, name, currentStart, currentEnd)
      const previous = averageSeverity(entries, name, previousStart, previousEnd)
      const delta = current !== null && previous !== null ? current - previous : null
      // Expressed as a share of the full None→Severe scale (0 to 2), so it's
      // always well-defined — including when the previous period was all
      // "None" (0), where a normal percent-change would divide by zero.
      const changePct = delta !== null ? Math.round((delta / 2) * 100) : null
      const direction = directionFor(changePct)
      return { name, current, previous, direction, changePct }
    })
  }, [entries, symptomNames, period])

  if (symptomNames.length === 0) return null

  return (
    <section className="entry-card">
      <div className="trend-header">
        <h2 className="entry-card__title">Trend by symptom</h2>
        <div className="period-toggle">
          <button
            type="button"
            className={`period-toggle__btn ${period === 'week' ? 'period-toggle__btn--active' : ''}`}
            onClick={() => setPeriod('week')}
          >
            Weekly
          </button>
          <button
            type="button"
            className={`period-toggle__btn ${period === 'month' ? 'period-toggle__btn--active' : ''}`}
            onClick={() => setPeriod('month')}
          >
            Monthly
          </button>
        </div>
      </div>

      <p className="trend-subtitle">
        Comparing this {period === 'week' ? 'week' : 'month'} to the previous one
        &nbsp;&middot;&nbsp; % = change in average severity (None&ndash;Severe scale)
      </p>

      <div className="trend-list">
        {rows.map((row) => {
          const meta = DIRECTION_META[row.direction]
          const color = colorByName[row.name]
          const currentPct = row.current !== null ? (row.current / 2) * 100 : 0
          const previousPct = row.previous !== null ? (row.previous / 2) * 100 : 0

          return (
            <div key={row.name} className="trend-row">
              <div className="trend-row__top">
                <span className="trend-row__name">
                  <span className="trend-row__dot" style={{ background: color }} />
                  {row.name}
                </span>
                <span className="trend-row__badge" style={{ color: meta.color }}>
                  <Arrow direction={row.direction} />
                  {meta.label}
                  {row.changePct !== null && row.direction !== 'unknown' && (
                    <span className="trend-row__pct">
                      {row.changePct > 0 ? '+' : ''}
                      {row.changePct}%
                    </span>
                  )}
                </span>
              </div>

              <div className="trend-bars">
                <div className="trend-bar">
                  <span className="trend-bar__label">This {period}</span>
                  <div className="trend-bar__track">
                    <div
                      className="trend-bar__fill"
                      style={{ width: `${currentPct}%`, background: color }}
                    />
                  </div>
                </div>
                <div className="trend-bar">
                  <span className="trend-bar__label">Last {period}</span>
                  <div className="trend-bar__track">
                    <div
                      className="trend-bar__fill trend-bar__fill--muted"
                      style={{ width: `${previousPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
