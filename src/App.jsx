import { useEffect, useState } from 'react'
import DailyEntry from './components/DailyEntry'
import History from './components/History'
import { ThemeContext } from './lib/theme'

const THEME_KEY = 'daily-log-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  try {
    const saved = window.localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    // localStorage unavailable — fall back to default
  }
  return 'dark'
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M10 1.5V3.5M10 16.5V18.5M18.5 10H16.5M3.5 10H1.5M15.6 4.4L14.2 5.8M5.8 14.2L4.4 15.6M15.6 15.6L14.2 14.2M5.8 5.8L4.4 4.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M17 11.5A7 7 0 118.5 3a5.5 5.5 0 108.5 8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function App() {
  const [tab, setTab] = useState('today')
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem(THEME_KEY, theme)
    } catch {
      // localStorage unavailable — theme just won't persist across visits
    }

    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#1C1B18' : '#FBF8F3')
    }
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={theme}>
      <div className="app-shell">
        <header className="app-header">
          <h1 className="app-header__title">Daily Log</h1>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </header>

        <main className="app-main">
          {tab === 'today' ? <DailyEntry /> : <History />}
        </main>

        <nav className="tab-bar">
          <button
            type="button"
            className={`tab-bar__btn ${tab === 'today' ? 'tab-bar__btn--active' : ''}`}
            onClick={() => setTab('today')}
          >
            <span className="tab-bar__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 9H21" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 2.5V5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M16 2.5V5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            Today
          </button>
          <button
            type="button"
            className={`tab-bar__btn ${tab === 'history' ? 'tab-bar__btn--active' : ''}`}
            onClick={() => setTab('history')}
          >
            <span className="tab-bar__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 17L9 10L13.5 14L21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 6H21V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            History
          </button>
        </nav>
      </div>
    </ThemeContext.Provider>
  )
}
