import { useEffect, useState, useCallback } from 'react'
import TagPicker from './TagPicker'
import SymptomTracker from './SymptomTracker'
import ExerciseSelector from './ExerciseSelector'
import {
  todayISO,
  fetchSavedItems,
  recordItemUse,
  fetchEntry,
  upsertEntry,
} from '../lib/data'

const EMPTY_ENTRY = {
  foods: [],
  exercise_level: 'none',
  sleep_hours: null,
  medications: [],
  symptoms: [],
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const today = todayISO()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  if (dateStr === today) return 'Today'
  if (dateStr === yesterdayStr) return 'Yesterday'
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function DailyEntry() {
  const [date, setDate] = useState(todayISO())
  const [entry, setEntry] = useState(EMPTY_ENTRY)
  const [savedFoods, setSavedFoods] = useState([])
  const [savedMeds, setSavedMeds] = useState([])
  const [savedSymptoms, setSavedSymptoms] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error

  const loadSavedItems = useCallback(async () => {
    const [foods, meds, symptoms] = await Promise.all([
      fetchSavedItems('food'),
      fetchSavedItems('medication'),
      fetchSavedItems('symptom'),
    ])
    setSavedFoods(foods)
    setSavedMeds(meds)
    setSavedSymptoms(symptoms)
  }, [])

  const loadEntry = useCallback(async (d) => {
    setLoading(true)
    try {
      const existing = await fetchEntry(d)
      if (existing) {
        setEntry({
          foods: existing.foods || [],
          exercise_level: existing.exercise_level || 'none',
          sleep_hours: existing.sleep_hours,
          medications: existing.medications || [],
          symptoms: existing.symptoms || [],
        })
      } else {
        setEntry(EMPTY_ENTRY)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSavedItems()
  }, [loadSavedItems])

  useEffect(() => {
    loadEntry(date)
  }, [date, loadEntry])

  function toggleItem(field, label) {
    setEntry((prev) => {
      const list = prev[field]
      const exists = list.includes(label)
      return {
        ...prev,
        [field]: exists ? list.filter((x) => x !== label) : [...list, label],
      }
    })
  }

  async function addNewItem(category, field, label) {
    toggleItem(field, label)
    try {
      await recordItemUse(category, label)
      loadSavedItems()
    } catch (e) {
      console.error(e)
    }
  }

  async function handleSymptomAdd(label) {
    try {
      await recordItemUse('symptom', label)
      loadSavedItems()
    } catch (e) {
      console.error(e)
    }
  }

  async function handleSave() {
    setSaveState('saving')
    try {
      // Record use for every selected chip so frequency ranking stays accurate
      await Promise.all([
        ...entry.foods.map((f) => recordItemUse('food', f)),
        ...entry.medications.map((m) => recordItemUse('medication', m)),
      ])

      await upsertEntry({
        entry_date: date,
        foods: entry.foods,
        exercise_level: entry.exercise_level,
        sleep_hours: entry.sleep_hours === '' ? null : entry.sleep_hours,
        medications: entry.medications,
        symptoms: entry.symptoms,
      })

      setSaveState('saved')
      loadSavedItems()
      setTimeout(() => setSaveState('idle'), 2000)
    } catch (e) {
      console.error(e)
      setSaveState('error')
    }
  }

  function shiftDate(deltaDays) {
    const d = new Date(date + 'T00:00:00')
    d.setDate(d.getDate() + deltaDays)
    const next = d.toISOString().slice(0, 10)
    if (next > todayISO()) return
    setDate(next)
  }

  return (
    <div className="daily-entry">
      <div className="date-nav">
        <button
          type="button"
          className="date-nav__btn"
          onClick={() => shiftDate(-1)}
          aria-label="Previous day"
        >
          ‹
        </button>
        <span className="date-nav__label">{formatDateLabel(date)}</span>
        <button
          type="button"
          className="date-nav__btn"
          onClick={() => shiftDate(1)}
          disabled={date === todayISO()}
          aria-label="Next day"
        >
          ›
        </button>
      </div>

      {loading ? (
        <div className="loading-placeholder">Loading…</div>
      ) : (
        <>
          <section className="entry-card">
            <h2 className="entry-card__title">What did you eat?</h2>
            <TagPicker
              savedItems={savedFoods}
              selected={entry.foods}
              onToggle={(label) => toggleItem('foods', label)}
              onAddNew={(label) => addNewItem('food', 'foods', label)}
              placeholder="Add a food"
            />
          </section>

          <section className="entry-card">
            <h2 className="entry-card__title">Exercise</h2>
            <ExerciseSelector
              value={entry.exercise_level}
              onChange={(level) =>
                setEntry((prev) => ({ ...prev, exercise_level: level }))
              }
            />
          </section>

          <section className="entry-card">
            <h2 className="entry-card__title">Sleep</h2>
            <div className="sleep-input-row">
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                inputMode="decimal"
                placeholder="0"
                value={entry.sleep_hours ?? ''}
                onChange={(e) =>
                  setEntry((prev) => ({
                    ...prev,
                    sleep_hours: e.target.value === '' ? null : Number(e.target.value),
                  }))
                }
                className="sleep-input"
              />
              <span className="sleep-input__suffix">hours</span>
            </div>
          </section>

          <section className="entry-card">
            <h2 className="entry-card__title">Medication</h2>
            <TagPicker
              savedItems={savedMeds}
              selected={entry.medications}
              onToggle={(label) => toggleItem('medications', label)}
              onAddNew={(label) => addNewItem('medication', 'medications', label)}
              placeholder="Add a medication"
            />
          </section>

          <section className="entry-card">
            <h2 className="entry-card__title">Symptoms</h2>
            <SymptomTracker
              savedSymptoms={savedSymptoms}
              symptoms={entry.symptoms}
              onChange={(symptoms) => setEntry((prev) => ({ ...prev, symptoms }))}
              onAddNew={handleSymptomAdd}
            />
          </section>

          <button
            type="button"
            className={`save-button save-button--${saveState}`}
            onClick={handleSave}
            disabled={saveState === 'saving'}
          >
            {saveState === 'saving' && 'Saving…'}
            {saveState === 'saved' && 'Saved ✓'}
            {saveState === 'error' && 'Couldn\u2019t save — try again'}
            {saveState === 'idle' && 'Save today\u2019s log'}
          </button>
        </>
      )}
    </div>
  )
}
