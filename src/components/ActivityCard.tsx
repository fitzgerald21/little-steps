import { useState } from 'react'
import { DOMAINS } from '../data/milestones'
import type { Suggestion } from '../lib/engine'

interface Props {
  suggestion: Suggestion
}

export default function ActivityCard({ suggestion }: Props) {
  const { activity: a, reasons } = suggestion
  const [showVariations, setShowVariations] = useState(false)
  const domain = DOMAINS[a.domain]

  return (
    <article className="activity-card" style={{ ['--accent' as string]: domain.color }}>
      <div className="ac-top">
        <div className="ac-emoji" aria-hidden>{a.emoji}</div>
        <div>
          <span className="chip domain-chip">{domain.emoji} {domain.label}</span>
          <h2 className="ac-title">{a.title}</h2>
          <p className="ac-meta">⏱ ~{a.minutes} min{a.materials.length === 0 ? ' · nothing needed' : ''}</p>
        </div>
      </div>

      <p className="ac-why">{a.why}</p>

      {a.materials.length > 0 && (
        <div className="ac-section">
          <h3>You’ll need</h3>
          <ul className="materials">
            {a.materials.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="ac-section">
        <h3>How to play</h3>
        <ol className="steps">
          {a.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>

      {a.safety && <p className="safety">⚠️ {a.safety}</p>}

      {(a.easier || a.harder) && (
        <div className="ac-section">
          <button className="link-btn" onClick={() => setShowVariations((v) => !v)} aria-expanded={showVariations}>
            {showVariations ? '− Hide' : '+ Show'} easier / harder versions
          </button>
          {showVariations && (
            <div className="variations">
              {a.easier && (
                <p><strong>Easier:</strong> {a.easier}</p>
              )}
              {a.harder && (
                <p><strong>Harder:</strong> {a.harder}</p>
              )}
            </div>
          )}
        </div>
      )}

      {reasons.length > 0 && (
        <div className="why-picked">
          <h3>Why we picked this</h3>
          <ul>
            {reasons.slice(0, 3).map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
