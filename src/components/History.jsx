import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { fetchAllEntries } from '../lib/data'

const SEVERITY_VALUE = { none: 0, mild: 1, severe: 2 }
const SEVERITY_LABEL = { 0: 'None', 1: 'Mild', 2: 'Severe' }
const LINE_COLORS = [
  '#7A9B7E', '#E3A857', '#E0735A', '#6B8FA8', '#A87CA0', '#B98D5E',
]

function shortDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__date">{shortDate(label)}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="chart-tooltip__row">
          <span className="chart-tooltip__dot" style={{ background: p.color }} />
          <span className="chart-tooltip__name">{p.dataKey}</span>
          <span className="chart-tooltip__value">{SEVERITY_LABEL[p.value]}</span>
        </div>
      ))}
    </div>
  )
}

export default function History() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [rangeDays, setRangeDays] = useState(14)

  useEffect(() => {
    fetchAllEntries()
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const { chartData, symptomNames } = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - rangeDays)
    const cutoffStr = cutoff.toISOString().slice(0, 10)

    const filtered = entries.filter((e) => e.entry_date >= cutoffStr)

    const nameSet = new Set()
    filtered.forEach((e) => {
      ;(e.symptoms || []).forEach((s) => nameSet.add(s.name))
    })
    const names = Array.from(nameSet)

    const data = filtered.map((e) => {
      const row = { date: e.entry_date }
      names.forEach((name) => {
        const found = (e.symptoms || []).find((s) => s.name === name)
        row[name] = found ? SEVERITY_VALUE[found.severity] : 0
      })
      return row
    })

    return { chartData: data, symptomNames: names }
  }, [entries, rangeDays])

  const recentEntries = useMemo(
    () => [...entries].reverse().slice(0, 10),
    [entries]
  )

  if (loading) {
    return <div className="loading-placeholder">Loading…</div>
  }

  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <p>No entries yet.</p>
        <p className="empty-state__sub">
          Once you save a daily log, your trends will show up here.
        </p>
      </div>
    )
  }

  return (
    <div className="history">
      <div className="range-toggle">
        {[7, 14, 30, 90].map((d) => (
          <button
            key={d}
            type="button"
            className={`range-toggle__btn ${rangeDays === d ? 'range-toggle__btn--active' : ''}`}
            onClick={() => setRangeDays(d)}
          >
            {d}d
          </button>
        ))}
      </div>

      <section className="entry-card">
        <h2 className="entry-card__title">Symptom severity over time</h2>
        {symptomNames.length === 0 ? (
          <p className="empty-state__sub">No symptoms logged in this range.</p>
        ) : (
          <>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="var(--color-line-soft)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={shortDate}
                    tick={{ fontSize: 11, fill: 'var(--color-ink-soft)' }}
                    axisLine={{ stroke: 'var(--color-line)' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 2]}
                    ticks={[0, 1, 2]}
                    tickFormatter={(v) => SEVERITY_LABEL[v]}
                    tick={{ fontSize: 11, fill: 'var(--color-ink-soft)' }}
                    axisLine={false}
                    tickLine={false}
                    width={56}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {symptomNames.map((name, i) => (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={LINE_COLORS[i % LINE_COLORS.length]}
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              {symptomNames.map((name, i) => (
                <span key={name} className="chart-legend__item">
                  <span
                    className="chart-legend__dot"
                    style={{ background: LINE_COLORS[i % LINE_COLORS.length] }}
                  />
                  {name}
                </span>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="entry-card">
        <h2 className="entry-card__title">Recent days</h2>
        <div className="history-list">
          {recentEntries.map((e) => (
            <div key={e.entry_date} className="history-row">
              <div className="history-row__date">{shortDate(e.entry_date)}</div>
              <div className="history-row__details">
                {e.foods?.length > 0 && (
                  <div className="history-row__line">
                    <span className="history-row__label">Food:</span> {e.foods.join(', ')}
                  </div>
                )}
                {e.sleep_hours != null && (
                  <div className="history-row__line">
                    <span className="history-row__label">Sleep:</span> {e.sleep_hours}h
                  </div>
                )}
                {e.medications?.length > 0 && (
                  <div className="history-row__line">
                    <span className="history-row__label">Meds:</span> {e.medications.join(', ')}
                  </div>
                )}
                {e.symptoms?.length > 0 && (
                  <div className="history-row__symptoms">
                    {e.symptoms.map((s) => (
                      <span key={s.name} className={`severity-tag severity-tag--${s.severity}`}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                )}
                {(!e.symptoms || e.symptoms.length === 0) && (
                  <div className="history-row__line history-row__line--muted">No symptoms</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
