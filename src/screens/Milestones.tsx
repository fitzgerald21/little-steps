import { useState } from 'react'
import MilestoneChecklist from '../components/MilestoneChecklist'
import { CHECKPOINTS, checkpointLabel, DOMAIN_ORDER, DOMAINS, MILESTONES } from '../data/milestones'
import { developmentalMonths, relevantCheckpoints } from '../lib/age'
import type { Child } from '../lib/types'

interface Props {
  child: Child
  updateChild: (id: string, fn: (c: Child) => Child) => void
}

export default function Milestones({ child, updateChild }: Props) {
  const age = developmentalMonths(child)
  const { relevant } = relevantCheckpoints(age)
  const [open, setOpen] = useState<Set<number>>(() => new Set(relevant))

  const toggle = (id: string, value: boolean) =>
    updateChild(child.id, (c) => {
      const milestones = { ...c.milestones }
      if (value) milestones[id] = new Date().toISOString()
      else delete milestones[id]
      return { ...c, milestones }
    })

  const flip = (cp: number) =>
    setOpen((s) => {
      const n = new Set(s)
      if (n.has(cp)) n.delete(cp)
      else n.add(cp)
      return n
    })

  // Progress across everything up to the upcoming checkpoint
  const scope = MILESTONES.filter((m) => m.age <= Math.max(...relevant))
  const progress = DOMAIN_ORDER.map((d) => {
    const items = scope.filter((m) => m.domain === d)
    const done = items.filter((m) => child.milestones[m.id]).length
    return { d, done, total: items.length }
  })

  const visible = CHECKPOINTS.filter((cp) => cp <= Math.max(...relevant) + 12)

  return (
    <div className="screen">
      <h1>Milestones</h1>
      <p className="muted">Tick off new skills as you see them. Activities adapt to what {child.name} is working on.</p>

      <div className="progress-grid">
        {progress.map(({ d, done, total }) => (
          <div className="progress-tile" key={d} style={{ ['--accent' as string]: DOMAINS[d].color }}>
            <span className="pt-label">{DOMAINS[d].emoji} {DOMAINS[d].label}</span>
            <span className="pt-count">{done}<small>/{total}</small></span>
            <span className="bar"><span style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></span>
          </div>
        ))}
      </div>

      {visible.map((cp) => {
        const items = MILESTONES.filter((m) => m.age === cp)
        const done = items.filter((m) => child.milestones[m.id]).length
        const isOpen = open.has(cp)
        const tag = cp > age ? (relevant.includes(cp) ? 'Up next' : 'Later') : relevant.includes(cp) ? 'Recent' : ''
        return (
          <section className="cp-group card" key={cp}>
            <button className="cp-head" onClick={() => flip(cp)} aria-expanded={isOpen}>
              <span className="cp-title">
                {checkpointLabel(cp)}
                {tag && <span className={`tag ${tag === 'Up next' ? 'tag-next' : ''}`}>{tag}</span>}
              </span>
              <span className="cp-count">
                {done}/{items.length} <span className={`chev ${isOpen ? 'open' : ''}`} aria-hidden>›</span>
              </span>
            </button>
            {isOpen && <MilestoneChecklist age={cp} met={child.milestones} onToggle={toggle} />}
          </section>
        )
      })}

      <div className="note">
        <p>
          <strong>Every child grows at their own pace.</strong> These checklists are based on the CDC’s “Learn the Signs. Act Early.”
          milestones, which describe what most children (75%) can do by each age. They’re not a test. If you have any
          concerns, talk with your child’s doctor. Early support makes a real difference.
        </p>
      </div>
    </div>
  )
}
