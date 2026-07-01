import { useState } from 'react'

/**
 * A chip-based multi-select with the ability to type a new item.
 * Previously used items appear as tappable chips so the user rarely needs
 * to type the same thing twice.
 */
export default function TagPicker({
  savedItems,
  selected,
  onToggle,
  onAddNew,
  placeholder,
}) {
  const [draft, setDraft] = useState('')

  function submitDraft() {
    const trimmed = draft.trim()
    if (!trimmed) return
    onAddNew(trimmed)
    setDraft('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitDraft()
    }
  }

  return (
    <div className="tag-picker">
      {savedItems.length > 0 && (
        <div className="tag-picker__chips">
          {savedItems.map((item) => {
            const isOn = selected.includes(item.label)
            return (
              <button
                key={item.id}
                type="button"
                className={`chip ${isOn ? 'chip--on' : ''}`}
                onClick={() => onToggle(item.label)}
                aria-pressed={isOn}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      )}

      <div className="tag-picker__input-row">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="tag-picker__input"
        />
        <button
          type="button"
          className="tag-picker__add-btn"
          onClick={submitDraft}
          disabled={!draft.trim()}
          aria-label="Add"
        >
          Add
        </button>
      </div>

      {selected.length > 0 && (
        <div className="tag-picker__selected-summary">
          {selected.map((label) => (
            <span key={label} className="selected-pill">
              {label}
              <button
                type="button"
                className="selected-pill__remove"
                onClick={() => onToggle(label)}
                aria-label={`Remove ${label}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
