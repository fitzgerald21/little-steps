import { useMemo, useState } from 'react'
import ActivityCard from '../components/ActivityCard'
import LogSheet from '../components/LogSheet'
import { ACTIVITY_BY_ID } from '../data/activities'
import { DOMAINS } from '../data/milestones'
import { doneToday, recommend, streak } from '../lib/engine'
import type { Child, LogEntry } from '../lib/types'

interface Props {
  child: Child
  updateChild: (id: string, fn: (c: Child) => Child) => void
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Today({ child, updateChild }: Props) {
  const suggestions = useMemo(() => recommend(child), [child])
  const [pickId, setPickId] = useState<string | null>(null)
  const [logging, setLogging] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const completed = doneToday(child)
  const days = streak(child)
  const pick = suggestions.find((s) => s.activity.id === pickId) ?? suggestions[0]
  const others = suggestions.filter((s) => s !== pick).slice(0, 3)

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const showAnother = () => {
    if (!pick) return
    const i = suggestions.indexOf(pick)
    const next = suggestions[(i + 1) % Math.min(suggestions.length, 8)]
    setPickId(next.activity.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const skip = () => {
    if (!pick) return
    updateChild(child.id, (c) => ({ ...c, skips: { ...c.skips, [pick.activity.id]: new Date().toISOString() } }))
    setPickId(null)
    flash('No problem. Here’s something else.')
  }

  const saveLog = (entry: LogEntry) => {
    updateChild(child.id, (c) => {
      const milestones = { ...c.milestones }
      for (const id of entry.newMilestones ?? []) milestones[id] = entry.date
      return { ...c, logs: [...c.logs, entry], milestones }
    })
    setLogging(false)
    setPickId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    flash(entry.newMilestones?.length ? '🌟 New milestone saved!' : 'Saved to your journal 💛')
  }

  return (
    <div className="screen today">
      <div className="today-head">
        <div>
          <p className="eyebrow">{greeting()}</p>
          <h1>{completed.length ? 'Nice work today!' : `Today with ${child.name}`}</h1>
        </div>
        {days > 0 && (
          <div className="streak" title="Days in a row">
            🔥 <strong>{days}</strong>
            <span>day{days === 1 ? '' : 's'}</span>
          </div>
        )}
      </div>

      {completed.length > 0 && (
        <div className="done-card">
          <p className="done-label">✓ Done today</p>
          {completed.map((l) => {
            const a = ACTIVITY_BY_ID[l.activityId]
            return a ? (
              <p key={l.id} className="done-item">
                {a.emoji} {a.title}
              </p>
            ) : null
          })}
          <p className="muted small">Up for more? Here’s another idea.</p>
        </div>
      )}

      {pick ? (
        <>
          <ActivityCard key={pick.activity.id} suggestion={pick} />
          <div className="action-bar">
            <button className="btn primary block" onClick={() => setLogging(true)}>
              We did it! 🎉
            </button>
            <div className="action-row">
              <button className="btn ghost" onClick={showAnother}>↻ Another idea</button>
              <button className="btn ghost" onClick={skip}>Not today</button>
            </div>
          </div>

          {others.length > 0 && (
            <section className="more">
              <h2 className="section-title">More ideas</h2>
              <div className="mini-list">
                {others.map((s) => (
                  <button
                    key={s.activity.id}
                    className="mini-card"
                    onClick={() => {
                      setPickId(s.activity.id)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    <span className="mini-emoji" aria-hidden>{s.activity.emoji}</span>
                    <span className="mini-body">
                      <span className="mini-title">{s.activity.title}</span>
                      <span className="mini-meta">
                        {DOMAINS[s.activity.domain].emoji} {DOMAINS[s.activity.domain].label} · {s.activity.minutes} min
                      </span>
                    </span>
                    <span className="chev" aria-hidden>›</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="empty">
          <p>We’re out of fresh ideas for now. Check back tomorrow, or update milestones to unlock new activities.</p>
        </div>
      )}

      {logging && pick && (
        <LogSheet
          activity={pick.activity}
          childName={child.name}
          emerging={pick.emerging}
          onSave={saveLog}
          onClose={() => setLogging(false)}
        />
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
