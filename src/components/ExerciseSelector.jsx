const LEVELS = [
  {
    key: 'none',
    label: 'None',
    color: 'var(--color-ink-soft)',
    bg: 'var(--color-line-soft)',
  },
  {
    key: 'light',
    label: 'Light',
    color: 'var(--color-sage-deep)',
    bg: 'var(--color-sage-pale)',
  },
  {
    key: 'intense',
    label: 'Intense',
    color: 'var(--color-indigo)',
    bg: 'var(--color-indigo-pale)',
  },
]

// Same calm-to-energetic visual language as the symptom severity glyphs:
// a still line, a gentle wave, a sharp zigzag — here reused to mean
// still → moving → pushing hard, rather than well → unwell.
function IntensityGlyph({ level }) {
  if (level === 'none') {
    return (
      <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
        <path d="M3 10H25" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  }
  if (level === 'light') {
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

export default function ExerciseSelector({ value, onChange }) {
  return (
    <div className="severity-selector" role="radiogroup" aria-label="Exercise intensity">
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
              <IntensityGlyph level={lvl.key} />
            </span>
            <span className="severity-option__label">{lvl.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export { LEVELS }
