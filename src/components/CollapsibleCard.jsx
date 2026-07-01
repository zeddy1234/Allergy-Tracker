import { useState } from 'react'

function ChevronIcon({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
      }}
    >
      <path
        d="M4.5 7L9 11.5L13.5 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * A card that starts collapsed, showing just a title and item count.
 * Tap the header to expand/collapse. Used for raw daily-log lists that
 * are useful to have but too noisy to show open by default.
 */
export default function CollapsibleCard({ title, count, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="entry-card">
      <button
        type="button"
        className="collapsible-header"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="collapsible-header__title">
          {title}
          {count != null && <span className="collapsible-header__count">{count}</span>}
        </span>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="collapsible-body">{children}</div>}
    </section>
  )
}
