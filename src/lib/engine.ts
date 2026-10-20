import { ACTIVITIES, ACTIVITY_BY_ID } from '../data/activities'
import { DOMAIN_ORDER, DOMAINS, MILESTONE_BY_ID } from '../data/milestones'
import { daysBetween, developmentalMonths, nextCheckpoint, toYMD } from './age'
import type { Activity, Child, Domain, LogEntry } from './types'

export interface Suggestion {
  activity: Activity
  score: number
  reasons: string[]
  /** Unmet milestones this activity targets, most relevant first */
  emerging: string[]
}

const ENJOY_SCORE = { loved: 2.5, okay: 0.5, meh: -2 } as const
const CHALLENGE_SHIFT = { easy: 1.5, right: 0, hard: -1.5 } as const

/**
 * How far ahead of (or behind) their age to aim in each domain, in months.
 * "Too easy" nudges it up, "too hard" nudges it down; recent feedback counts most.
 */
export function domainOffsets(child: Child): Record<Domain, number> {
  const out = { social: 0, language: 0, cognitive: 0, movement: 0 } as Record<Domain, number>
  const recent = [...child.logs].sort((a, b) => b.date.localeCompare(a.date))
  const seen = { social: 0, language: 0, cognitive: 0, movement: 0 } as Record<Domain, number>
  for (const log of recent) {
    const act = ACTIVITY_BY_ID[log.activityId]
    if (!act) continue
    const d = act.domain
    if (seen[d] >= 8) continue
    out[d] += CHALLENGE_SHIFT[log.challenge] * Math.pow(0.8, seen[d])
    seen[d]++
  }
  for (const d of DOMAIN_ORDER) out[d] = Math.max(-6, Math.min(6, out[d]))
  return out
}

function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Small deterministic jitter so the pick is stable for a day but varies across days. */
function jitter(seed: string): number {
  return (hash(seed) % 1000) / 1000
}

function lastLogFor(logs: LogEntry[], activityId: string): LogEntry | undefined {
  let best: LogEntry | undefined
  for (const l of logs) if (l.activityId === activityId && (!best || l.date > best.date)) best = l
  return best
}

export function recommend(child: Child, now = new Date()): Suggestion[] {
  const age = developmentalMonths(child, now)
  const met = new Set(Object.keys(child.milestones))
  const offsets = domainOffsets(child)
  const upcoming = nextCheckpoint(age + 0.01)
  const dayKey = toYMD(now)

  // Domain balance over the past week
  const weekCounts = { social: 0, language: 0, cognitive: 0, movement: 0 } as Record<Domain, number>
  for (const log of child.logs) {
    const act = ACTIVITY_BY_ID[log.activityId]
    if (act && daysBetween(new Date(log.date), now) <= 7) weekCounts[act.domain]++
  }
  const maxWeek = Math.max(...Object.values(weekCounts))
  const totalWeek = Object.values(weekCounts).reduce((a, b) => a + b, 0)

  const scored: Suggestion[] = []

  for (const activity of ACTIVITIES) {
    const target = age + offsets[activity.domain]
    if (target < activity.minAge - 1.5 || target > activity.maxAge + 4) continue
    if (activity.requires?.some((r) => !met.has(r))) continue

    const reasons: string[] = []
    let score = 0

    // 1. Skills that are emerging right now matter most
    const emerging = activity.targets
      .filter((id) => !met.has(id) && MILESTONE_BY_ID[id])
      .sort((a, b) => MILESTONE_BY_ID[a].age - MILESTONE_BY_ID[b].age)
    let skillScore = 0
    for (const id of emerging) {
      const mAge = MILESTONE_BY_ID[id].age
      if (mAge <= age + 0.5) skillScore += 3
      else if (mAge <= upcoming) skillScore += 2.5
      else if (mAge <= age + 8) skillScore += 1
    }
    skillScore += (activity.targets.length - emerging.length) * 0.3
    score += Math.min(6, skillScore)
    const nearEmerging = emerging.filter((id) => MILESTONE_BY_ID[id].age <= upcoming)
    if (nearEmerging.length) {
      const text = MILESTONE_BY_ID[nearEmerging[0]].text
      reasons.push(`Works on: ${text[0].toLowerCase()}${text.slice(1)}`)
    }

    // 2. Age fit, adjusted by feedback in this domain
    if (target >= activity.minAge && target <= activity.maxAge) score += 2
    else score -= 0.5
    if (offsets[activity.domain] >= 1.5) reasons.push(`A bit more of a stretch, since recent ${DOMAINS[activity.domain].label.toLowerCase()} activities felt easy`)
    if (offsets[activity.domain] <= -1.5) reasons.push(`Gentler pace, since recent ${DOMAINS[activity.domain].label.toLowerCase()} activities felt tricky`)

    // 3. History with this exact activity
    const mine = child.logs.filter((l) => l.activityId === activity.id)
    if (mine.length) {
      const avg = mine.reduce((s, l) => s + ENJOY_SCORE[l.enjoyment], 0) / mine.length
      score += avg
      if (avg >= 2) reasons.push('A favorite. You both loved this before')
      const last = lastLogFor(child.logs, activity.id)!
      const daysAgo = daysBetween(new Date(last.date), now)
      if (daysAgo < 2) score -= 8
      else if (daysAgo < 5) score -= 3
      else if (daysAgo < 10) score -= 1
      if (last.challenge === 'easy' && emerging.length === 0) score -= 2
    } else {
      score += 1.5
    }

    // 4. Skipped recently
    const skipped = child.skips[activity.id]
    if (skipped && daysBetween(new Date(skipped), now) < 4) score -= 5

    // 5. Keep a balance across domains
    if (totalWeek >= 2) {
      const gap = maxWeek - weekCounts[activity.domain]
      score += Math.min(2, gap * 0.6)
      if (gap >= 2) reasons.push(`Not much ${DOMAINS[activity.domain].label.toLowerCase()} play this week`)
    }

    // 6. Parent-chosen focus areas
    if (child.focus.includes(activity.domain)) {
      score += 2
      reasons.push(`Matches your focus on ${DOMAINS[activity.domain].label.toLowerCase()}`)
    }

    score += jitter(`${child.id}|${dayKey}|${activity.id}`) * 1.5

    scored.push({ activity, score, reasons, emerging })
  }

  return scored.sort((a, b) => b.score - a.score)
}

export function doneToday(child: Child, now = new Date()): LogEntry[] {
  const key = toYMD(now)
  return child.logs.filter((l) => toYMD(new Date(l.date)) === key)
}

/** Consecutive days (ending today or yesterday) with at least one activity. */
export function streak(child: Child, now = new Date()): number {
  const days = new Set(child.logs.map((l) => toYMD(new Date(l.date))))
  const d = new Date(now)
  if (!days.has(toYMD(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (days.has(toYMD(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}
