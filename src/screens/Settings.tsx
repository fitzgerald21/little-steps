import { useRef } from 'react'
import { DOMAIN_ORDER, DOMAINS } from '../data/milestones'
import { developmentalMonths, formatAge, toYMD } from '../lib/age'
import { isValidState } from '../lib/storage'
import type { AppState, Child, Domain } from '../lib/types'

interface Props {
  state: AppState
  child: Child
  updateChild: (id: string, fn: (c: Child) => Child) => void
  removeChild: (id: string) => void
  setActive: (id: string) => void
  replaceAll: (s: AppState) => void
  onAddChild: () => void
}

export default function Settings({ state, child, updateChild, removeChild, setActive, replaceAll, onAddChild }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const set = (patch: Partial<Child>) => updateChild(child.id, (c) => ({ ...c, ...patch }))

  const toggleFocus = (d: Domain) =>
    set({ focus: child.focus.includes(d) ? child.focus.filter((x) => x !== d) : [...child.focus, d] })

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `little-steps-backup-${toYMD(new Date())}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text())
      if (!isValidState(parsed)) throw new Error('invalid')
      if (confirm('Replace everything on this device with this backup?')) replaceAll(parsed)
    } catch {
      alert('That file doesn’t look like a Little Steps backup.')
    }
  }

  return (
    <div className="screen">
      <h1>Profile</h1>

      <section className="card form-card">
        <label className="field">
          <span>Name</span>
          <input value={child.name} onChange={(e) => set({ name: e.target.value })} />
        </label>
        <label className="field">
          <span>Birthday</span>
          <input
            type="date"
            value={child.birthday}
            max={toYMD(new Date())}
            onChange={(e) => e.target.value && set({ birthday: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Weeks born early (0 if full term)</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={17}
            value={child.weeksEarly}
            onChange={(e) => set({ weeksEarly: Math.max(0, Math.min(17, Number(e.target.value) || 0)) })}
          />
        </label>
        <p className="muted small">
          Current {child.weeksEarly > 0 ? 'adjusted ' : ''}age: {formatAge(developmentalMonths(child))}
        </p>
      </section>

      <section className="card">
        <h3>Focus areas</h3>
        <p className="muted small">Want more of a certain kind of play? We’ll suggest it more often.</p>
        <div className="chip-row">
          {DOMAIN_ORDER.map((d) => (
            <button
              key={d}
              className={`chip toggle ${child.focus.includes(d) ? 'on' : ''}`}
              onClick={() => toggleFocus(d)}
              aria-pressed={child.focus.includes(d)}
            >
              {DOMAINS[d].emoji} {DOMAINS[d].label}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Children</h3>
        <ul className="child-list">
          {state.children.map((c) => (
            <li key={c.id}>
              <button className={`child-row ${c.id === child.id ? 'active' : ''}`} onClick={() => setActive(c.id)}>
                <span>{c.name}</span>
                <span className="muted small">{formatAge(developmentalMonths(c))}</span>
              </button>
            </li>
          ))}
        </ul>
        <button className="btn ghost block" onClick={onAddChild}>+ Add another child</button>
      </section>

      <section className="card">
        <h3>Backup</h3>
        <p className="muted small">
          Your data is saved privately in this browser. Export a backup now and then, or to move to a new phone.
        </p>
        <div className="action-row">
          <button className="btn ghost" onClick={exportData}>Export</button>
          <button className="btn ghost" onClick={() => fileRef.current?.click()}>Import</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importData(f)
              e.target.value = ''
            }}
          />
        </div>
      </section>

      <section className="card danger-zone">
        <button
          className="btn danger block"
          onClick={() => {
            if (confirm(`Delete ${child.name}’s profile, milestones, and journal? This can’t be undone.`)) removeChild(child.id)
          }}
        >
          Delete {child.name}’s profile
        </button>
      </section>

      <p className="fineprint center">
        Little Steps offers play ideas, not medical advice. Milestones adapted from the CDC’s “Learn the Signs. Act Early.”
        program.
      </p>
    </div>
  )
}
