import { useState } from 'react'
import { MILESTONE_BY_ID } from '../data/milestones'
import { uid } from '../lib/storage'
import type { Activity, Challenge, Enjoyment, LogEntry } from '../lib/types'
import Sheet from './Sheet'

interface Props {
  activity: Activity
  childName: string
  /** Unmet milestones this activity works on */
  emerging: string[]
  onSave: (entry: LogEntry) => void
  onClose: () => void
}

const ENJOY: { id: Enjoyment; emoji: string; label: string }[] = [
  { id: 'loved', emoji: '😍', label: 'Loved it' },
  { id: 'okay', emoji: '🙂', label: 'It was okay' },
  { id: 'meh', emoji: '😕', label: 'Not into it' },
]

const CHALLENGE: { id: Challenge; label: string }[] = [
  { id: 'easy', label: 'Too easy' },
  { id: 'right', label: 'Just right' },
  { id: 'hard', label: 'Too hard' },
]

export default function LogSheet({ activity, childName, emerging, onSave, onClose }: Props) {
  const [enjoyment, setEnjoyment] = useState<Enjoyment | null>(null)
  const [challenge, setChallenge] = useState<Challenge>('right')
  const [note, setNote] = useState('')
  const [newSkills, setNewSkills] = useState<string[]>([])

  const save = () => {
    if (!enjoyment) return
    onSave({
      id: uid(),
      activityId: activity.id,
      date: new Date().toISOString(),
      enjoyment,
      challenge,
      note: note.trim() || undefined,
      newMilestones: newSkills.length ? newSkills : undefined,
    })
  }

  return (
    <Sheet title={`How did “${activity.title}” go?`} onClose={onClose}>
      <fieldset className="q">
        <legend>Did {childName} enjoy it?</legend>
        <div className="choice-row">
          {ENJOY.map((e) => (
            <button
              key={e.id}
              type="button"
              className={`choice big ${enjoyment === e.id ? 'selected' : ''}`}
              onClick={() => setEnjoyment(e.id)}
              aria-pressed={enjoyment === e.id}
            >
              <span className="choice-emoji" aria-hidden>{e.emoji}</span>
              {e.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="q">
        <legend>How was the challenge?</legend>
        <div className="segmented">
          {CHALLENGE.map((c) => (
            <button
              key={c.id}
              type="button"
              className={challenge === c.id ? 'selected' : ''}
              onClick={() => setChallenge(c.id)}
              aria-pressed={challenge === c.id}
            >
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>

      {emerging.length > 0 && (
        <fieldset className="q">
          <legend>Did you notice any of these? 🌟</legend>
          <ul className="checklist compact">
            {emerging.map((id) => {
              const checked = newSkills.includes(id)
              return (
                <li key={id}>
                  <label className={`check-row ${checked ? 'checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        setNewSkills((s) => (e.target.checked ? [...s, id] : s.filter((x) => x !== id)))
                      }
                    />
                    <span className="check-box" aria-hidden>{checked ? '✓' : ''}</span>
                    <span className="check-text">{MILESTONE_BY_ID[id].text}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>
      )}

      <label className="field">
        <span>Notes (optional)</span>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Funny moments, what worked, what didn’t…"
        />
      </label>

      <button className="btn primary block" disabled={!enjoyment} onClick={save}>
        Save to journal
      </button>
    </Sheet>
  )
}
