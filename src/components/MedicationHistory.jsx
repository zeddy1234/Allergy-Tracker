import { useMemo, useState } from 'react'
import { useTheme } from '../lib/theme'
import CollapsibleCard from './CollapsibleCard'

const MED_BAR_LIGHT = '#1F7A6C'
const MED_BAR_DARK = '#5FD6C0'

function toDateOnly(d) {
  return d.toISOString().slice(0, 10)
}

function shortDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function computeMedCounts(entries, startStr, endStr) {
  const counts = {}
  entries.forEach((e) => {
    if (e.entry_date < startStr || e.entry_date > endStr) return
    ;(e.medications || []).forEach((m) => {
      counts[m] = (counts[m] || 0) + 1
    })
  })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export default function MedicationHistory({ entries, rangeDays }) {
  const theme = useTheme()
  const barColor = theme === 'dark' ? MED_BAR_DARK : MED_BAR_LIGHT
  const [period, setPeriod] = useState('week') // 'week' | 'month'

  const rankedMeds = useMemo(() => {
    const periodDays = period === 'week' ? 7 : 30
    const today = new Date()
    const end = toDateOnly(today)
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - (periodDays - 1))
    const start = toDateOnly(startDate)

    return computeMedCounts(entries, start, end)
  }, [entries, period])

  const maxCount = rankedMeds.length > 0 ? rankedMeds[0].count : 0

  const medLog = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - rangeDays)
    const cutoffStr = cutoff.toISOString().slice(0, 10)

    return entries
      .filter((e) => e.entry_date >= cutoffStr && e.medications && e.medications.length > 0)
      .slice()
      .reverse()
  }, [entries, rangeDays])

  return (
    <>
      <section className="entry-card">
        <div className="trend-header">
          <h2 className="entry-card__title">Most-taken medications</h2>
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

        {rankedMeds.length === 0 ? (
          <p className="empty-state__sub">
            No medication logged in the last {period === 'week' ? '7 days' : '30 days'}.
          </p>
        ) : (
          <div className="rank-list">
            {rankedMeds.map((med) => (
              <div key={med.name} className="rank-row">
                <span className="rank-row__name">{med.name}</span>
                <div className="rank-row__bar-track">
                  <div
                    className="rank-row__bar-fill"
                    style={{
                      width: `${(med.count / maxCount) * 100}%`,
                      background: barColor,
                    }}
                  />
                </div>
                <span className="rank-row__count">
                  {med.count} {med.count === 1 ? 'day' : 'days'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <CollapsibleCard title="Medication log" count={medLog.length}>
        {medLog.length === 0 ? (
          <p className="empty-state__sub">No medication logged in this range.</p>
        ) : (
          <div className="daily-log-list">
            {medLog.map((e) => (
              <div key={e.entry_date} className="daily-log-row">
                <span className="daily-log-row__date">{shortDate(e.entry_date)}</span>
                <span className="daily-log-row__items">{e.medications.join(', ')}</span>
              </div>
            ))}
          </div>
        )}
      </CollapsibleCard>
    </>
  )
}
