import { ACTIVITY_BY_ID } from '../data/activities'
import { DOMAIN_ORDER, DOMAINS, MILESTONE_BY_ID } from '../data/milestones'
import { streak } from '../lib/engine'
import type { Child, Domain } from '../lib/types'

interface Props {
  child: Child
  updateChild: (id: string, fn: (c: Child) => Child) => void
}

const ENJOY_EMOJI = { loved: '😍', okay: '🙂', meh: '😕' }
const CHALLENGE_LABEL = { easy: 'Too easy', right: 'Just right', hard: 'Too hard' }

function dayLabel(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function Journal({ child, updateChild }: Props) {
  const logs = [...child.logs].sort((a, b) => b.date.localeCompare(a.date))

  const domainCounts = DOMAIN_ORDER.map((d) => ({
    d,
    n: child.logs.filter((l) => ACTIVITY_BY_ID[l.activityId]?.domain === d).length,
  }))
  const maxCount = Math.max(1, ...domainCounts.map((x) => x.n))
  const loved = child.logs.filter((l) => l.enjoyment === 'loved').length

  const remove = (id: string) => {
    if (!confirm('Delete this journal entry?')) return
    updateChild(child.id, (c) => ({ ...c, logs: c.logs.filter((l) => l.id !== id) }))
  }

  const groups: { label: string; items: typeof logs }[] = []
  for (const l of logs) {
    const label = dayLabel(l.date)
    const g = groups[groups.length - 1]
    if (g && g.label === label) g.items.push(l)
    else groups.push({ label, items: [l] })
  }

  return (
    <div className="screen">
      <h1>Journal</h1>

      <div className="stats">
        <div className="stat"><strong>{child.logs.length}</strong><span>{child.logs.length === 1 ? 'activity' : 'activities'}</span></div>
        <div className="stat"><strong>{streak(child)}</strong><span>day streak</span></div>
        <div className="stat"><strong>{loved}</strong><span>loved 😍</span></div>
      </div>

      {child.logs.length > 0 && (
        <div className="card balance">
          <h3>Play balance</h3>
          {domainCounts.map(({ d, n }) => (
            <div className="balance-row" key={d} style={{ ['--accent' as string]: DOMAINS[d as Domain].color }}>
              <span className="balance-label">{DOMAINS[d as Domain].emoji} {DOMAINS[d as Domain].label}</span>
              <span className="bar"><span style={{ width: `${(n / maxCount) * 100}%` }} /></span>
              <span className="balance-n">{n}</span>
            </div>
          ))}
        </div>
      )}

      {groups.length === 0 && (
        <div className="empty">
          <p>📔 Your play journal will fill up here. Try today’s activity and tell us how it went!</p>
        </div>
      )}

      {groups.map((g) => (
        <section key={g.label} className="journal-day">
          <h2 className="section-title">{g.label}</h2>
          {g.items.map((l) => {
            const a = ACTIVITY_BY_ID[l.activityId]
            return (
              <article className="journal-entry card" key={l.id}>
                <div className="je-head">
                  <span className="je-emoji" aria-hidden>{a?.emoji ?? '✨'}</span>
                  <div className="je-main">
                    <strong>{a?.title ?? 'Activity'}</strong>
                    <span className="muted small">
                      {ENJOY_EMOJI[l.enjoyment]} · {CHALLENGE_LABEL[l.challenge]}
                    </span>
                  </div>
                  <button className="icon-btn subtle" onClick={() => remove(l.id)} aria-label="Delete entry">🗑</button>
                </div>
                {l.note && <p className="je-note">{l.note}</p>}
                {l.newMilestones?.map((id) => (
                  <p key={id} className="je-milestone">🌟 {MILESTONE_BY_ID[id]?.text}</p>
                ))}
              </article>
            )
          })}
        </section>
      ))}
    </div>
  )
}
