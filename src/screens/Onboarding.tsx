import { useMemo, useState } from 'react'
import MilestoneChecklist from '../components/MilestoneChecklist'
import { checkpointLabel, MILESTONES } from '../data/milestones'
import { developmentalMonths, formatAge, relevantCheckpoints, toYMD } from '../lib/age'
import { uid } from '../lib/storage'
import type { Child } from '../lib/types'

interface Props {
  firstTime: boolean
  onDone: (child: Child) => void
  onCancel?: () => void
}

export default function Onboarding({ firstTime, onDone, onCancel }: Props) {
  const [step, setStep] = useState(firstTime ? 0 : 1)
  const [name, setName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [early, setEarly] = useState(false)
  const [weeksEarly, setWeeksEarly] = useState(4)
  const [met, setMet] = useState<Record<string, string>>({})

  const today = toYMD(new Date())
  const age = birthday ? developmentalMonths({ birthday, weeksEarly: early ? weeksEarly : 0 }) : 0
  const { earlier, relevant } = useMemo(() => relevantCheckpoints(age), [age])
  const validBasics = name.trim().length > 0 && birthday && birthday <= today

  const toggle = (id: string, value: boolean) =>
    setMet((prev) => {
      const next = { ...prev }
      if (value) next[id] = new Date().toISOString()
      else delete next[id]
      return next
    })

  const finish = () => {
    const now = new Date().toISOString()
    const milestones = { ...met }
    // Earlier checkpoints are assumed done; parents can untick them later.
    for (const m of MILESTONES) if (earlier.includes(m.age) && !milestones[m.id]) milestones[m.id] = now
    onDone({
      id: uid(),
      name: name.trim(),
      birthday,
      weeksEarly: early ? weeksEarly : 0,
      milestones,
      logs: [],
      skips: {},
      focus: [],
      createdAt: now,
    })
  }

  return (
    <div className="onboarding">
      {step === 0 && (
        <section className="ob-step ob-welcome">
          <img className="ob-hero" src={`${import.meta.env.BASE_URL}icon.svg`} alt="" />
          <h1>Little Steps</h1>
          <p className="lede">
            A daily play idea for you and your little one, matched to their age and the skills they’re working on right now.
          </p>
          <ul className="ob-points">
            <li><span>🌱</span>Tell us what they can already do</li>
            <li><span>☀️</span>Get one simple, fun activity each day</li>
            <li><span>💬</span>Tell us how it went, and the ideas get better</li>
          </ul>
          <button className="btn primary block" onClick={() => setStep(1)}>Get started</button>
          <p className="fineprint">Everything stays private on this device.</p>
        </section>
      )}

      {step === 1 && (
        <section className="ob-step">
          {onCancel && (
            <button className="link-btn back" onClick={onCancel}>← Cancel</button>
          )}
          <p className="eyebrow">Step 1 of 2</p>
          <h2>Who are we playing with?</h2>
          <label className="field">
            <span>Name or nickname</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Olive" autoComplete="off" />
          </label>
          <label className="field">
            <span>Birthday</span>
            <input type="date" value={birthday} max={today} onChange={(e) => setBirthday(e.target.value)} />
          </label>
          <label className="toggle-row">
            <input type="checkbox" checked={early} onChange={(e) => setEarly(e.target.checked)} />
            <span>Born 3+ weeks early</span>
          </label>
          {early && (
            <label className="field">
              <span>How many weeks early?</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={17}
                value={weeksEarly}
                onChange={(e) => setWeeksEarly(Math.max(0, Math.min(17, Number(e.target.value) || 0)))}
              />
              <small>We’ll use their adjusted age until they turn 2.</small>
            </label>
          )}
          {validBasics && (
            <p className="hint">
              {name.trim()} is <strong>{formatAge(age)}</strong>
              {early ? ' (adjusted)' : ''}.
            </p>
          )}
          <button className="btn primary block" disabled={!validBasics} onClick={() => setStep(2)}>
            Next
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="ob-step">
          <button className="link-btn back" onClick={() => setStep(1)}>← Back</button>
          <p className="eyebrow">Step 2 of 2</p>
          <h2>What can {name.trim()} do already?</h2>
          <p className="muted">
            Tick anything you’ve seen. It’s completely normal to have lots unticked, especially in the upcoming group.
          </p>
          {relevant.map((cp) => (
            <div className="cp-group" key={cp}>
              <h3 className="cp-title">
                {cp > age ? 'Coming up · ' : ''}
                {checkpointLabel(cp)}
              </h3>
              <MilestoneChecklist age={cp} met={met} onToggle={toggle} />
            </div>
          ))}
          {earlier.length > 0 && (
            <p className="fineprint">
              We’ll assume milestones from earlier ages are done. You can change that anytime in the Milestones tab.
            </p>
          )}
          <button className="btn primary block sticky-cta" onClick={finish}>
            See today’s activity
          </button>
        </section>
      )}
    </div>
  )
}
