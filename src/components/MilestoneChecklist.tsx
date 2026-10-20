import { DOMAINS, MILESTONES } from '../data/milestones'

interface Props {
  age: number
  met: Record<string, string>
  onToggle: (id: string, value: boolean) => void
}

export default function MilestoneChecklist({ age, met, onToggle }: Props) {
  const items = MILESTONES.filter((m) => m.age === age)
  return (
    <ul className="checklist">
      {items.map((m) => {
        const checked = !!met[m.id]
        return (
          <li key={m.id}>
            <label className={`check-row ${checked ? 'checked' : ''}`}>
              <input type="checkbox" checked={checked} onChange={(e) => onToggle(m.id, e.target.checked)} />
              <span className="check-box" aria-hidden>{checked ? '✓' : ''}</span>
              <span className="check-text">{m.text}</span>
              <span className="check-domain" title={DOMAINS[m.domain].label} aria-label={DOMAINS[m.domain].label}>
                {DOMAINS[m.domain].emoji}
              </span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}
