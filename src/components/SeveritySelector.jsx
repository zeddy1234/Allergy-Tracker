const LEVELS = [
  {
    key: 'none',
    label: 'No symptoms',
    color: 'var(--color-sage-deep)',
    bg: 'var(--color-sage-pale)',
  },
  {
    key: 'mild',
    label: 'Mild',
    color: 'var(--color-amber)',
    bg: 'var(--color-amber-pale)',
  },
  {
    key: 'severe',
    label: 'Severe',
    color: 'var(--color-coral)',
    bg: 'var(--color-coral-pale)',
  },
]

// Three calm-to-stormy marks: a still line, a gentle wave, a sharp zigzag.
// These echo a weather-glass needle rather than a clinical traffic light.
function SeverityGlyph({ level }) {
  if (level === 'none') {
    return (
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
        <path d="M3 10H25" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  }
  if (level === 'mild') {
    return (
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
        <path
          d="M2 12C5 7 8 7 11 12C14 17 17 17 20 12C22.5 8 24.5 8 26 11"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    )
  }
  return (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
      <path
        d="M3 4L11 11L6 11L21 18L13 9L19 9L3 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
    </svg>
  )
}

export default function SeveritySelector({ value, onChange }) {
  return (
    <div className="severity-selector" role="radiogroup" aria-label="Symptom severity">
      {LEVELS.map((lvl) => {
        const active = value === lvl.key
        return (
          <button
            key={lvl.key}
            type="button"
            role="radio"
            aria-checked={active}
            className={`severity-option ${active ? 'severity-option--active' : ''}`}
            style={{
              '--lvl-color': lvl.color,
              '--lvl-bg': lvl.bg,
            }}
            onClick={() => onChange(lvl.key)}
          >
            <span className="severity-option__glyph">
              <SeverityGlyph level={lvl.key} />
            </span>
            <span className="severity-option__label">{lvl.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export { LEVELS }
