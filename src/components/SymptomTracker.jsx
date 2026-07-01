import { useState } from 'react'
import SeveritySelector from './SeveritySelector'

export default function SymptomTracker({ savedSymptoms, symptoms, onChange, onAddNew }) {
  const [draft, setDraft] = useState('')

  const activeNames = symptoms.map((s) => s.name)

  function addSymptomByName(name) {
    const trimmed = name.trim()
    if (!trimmed) return
    if (activeNames.includes(trimmed)) return
    onChange([...symptoms, { name: trimmed, severity: 'mild' }])
    onAddNew(trimmed)
  }

  function removeSymptom(name) {
    onChange(symptoms.filter((s) => s.name !== name))
  }

  function setSeverity(name, severity) {
    onChange(symptoms.map((s) => (s.name === name ? { ...s, severity } : s)))
  }

  function submitDraft() {
    addSymptomByName(draft)
    setDraft('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitDraft()
    }
  }

  const unselectedSaved = savedSymptoms.filter((s) => !activeNames.includes(s.label))

  return (
    <div className="symptom-tracker">
      {unselectedSaved.length > 0 && (
        <div className="tag-picker__chips">
          {unselectedSaved.map((item) => (
            <button
              key={item.id}
              type="button"
              className="chip"
              onClick={() => addSymptomByName(item.label)}
            >
              + {item.label}
            </button>
          ))}
        </div>
      )}

      <div className="tag-picker__input-row">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a symptom (e.g. hives, headache)"
          className="tag-picker__input"
        />
        <button
          type="button"
          className="tag-picker__add-btn"
          onClick={submitDraft}
          disabled={!draft.trim()}
        >
          Add
        </button>
      </div>

      {symptoms.length > 0 && (
        <div className="symptom-tracker__list">
          {symptoms.map((s) => (
            <div key={s.name} className="symptom-row">
              <div className="symptom-row__header">
                <span className="symptom-row__name">{s.name}</span>
                <button
                  type="button"
                  className="symptom-row__remove"
                  onClick={() => removeSymptom(s.name)}
                  aria-label={`Remove ${s.name}`}
                >
                  ×
                </button>
              </div>
              <SeveritySelector
                value={s.severity}
                onChange={(sev) => setSeverity(s.name, sev)}
              />
            </div>
          ))}
        </div>
      )}

      {symptoms.length === 0 && (
        <p className="symptom-tracker__empty">
          No symptoms added yet today — tap a chip above or type one in.
        </p>
      )}
    </div>
  )
}
