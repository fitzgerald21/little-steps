import { useState } from 'react'
import { developmentalMonths, formatAge } from './lib/age'
import { useAppState } from './lib/storage'
import Onboarding from './screens/Onboarding'
import Today from './screens/Today'
import Milestones from './screens/Milestones'
import Journal from './screens/Journal'
import Settings from './screens/Settings'

type Tab = 'today' | 'milestones' | 'journal' | 'settings'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'today', label: 'Today', icon: '☀️' },
  { id: 'milestones', label: 'Milestones', icon: '🌱' },
  { id: 'journal', label: 'Journal', icon: '📔' },
  { id: 'settings', label: 'Profile', icon: '👤' },
]

export default function App() {
  const store = useAppState()
  const { state, activeChild } = store
  const [tab, setTab] = useState<Tab>('today')
  const [adding, setAdding] = useState(false)

  if (!activeChild || adding) {
    return (
      <Onboarding
        firstTime={state.children.length === 0}
        onCancel={state.children.length ? () => setAdding(false) : undefined}
        onDone={(child) => {
          store.addChild(child)
          setAdding(false)
          setTab('today')
        }}
      />
    )
  }

  const age = developmentalMonths(activeChild)

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <img className="brand" src={`${import.meta.env.BASE_URL}icon.svg`} alt="" />
          {state.children.length > 1 ? (
            <select
              className="child-switch"
              value={activeChild.id}
              onChange={(e) => store.setActive(e.target.value)}
              aria-label="Switch child"
            >
              {state.children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="child-name">{activeChild.name}</span>
          )}
          <span className="age-pill">
            {formatAge(age)}
            {activeChild.weeksEarly > 0 && age < 24 ? ' (adj.)' : ''}
          </span>
        </div>
      </header>

      <main className="content">
        {tab === 'today' && <Today child={activeChild} updateChild={store.updateChild} />}
        {tab === 'milestones' && <Milestones child={activeChild} updateChild={store.updateChild} />}
        {tab === 'journal' && <Journal child={activeChild} updateChild={store.updateChild} />}
        {tab === 'settings' && (
          <Settings
            state={state}
            child={activeChild}
            updateChild={store.updateChild}
            removeChild={store.removeChild}
            setActive={store.setActive}
            replaceAll={store.replaceAll}
            onAddChild={() => setAdding(true)}
          />
        )}
      </main>

      <nav className="tabbar" aria-label="Main">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => {
              setTab(t.id)
              window.scrollTo({ top: 0 })
            }}
            aria-current={tab === t.id ? 'page' : undefined}
          >
            <span className="tab-icon" aria-hidden>{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
