import { useState } from 'react'
import DailyEntry from './components/DailyEntry'
import History from './components/History'

export default function App() {
  const [tab, setTab] = useState('today')

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-header__title">Daily Log</h1>
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
  )
}
