import { CHECKPOINTS } from '../data/milestones'
import type { Child } from './types'

const MS_PER_DAY = 86_400_000
const DAYS_PER_MONTH = 30.4375

export function parseDate(ymd: string): Date {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toYMD(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function daysBetween(a: Date, b: Date): number {
  return (b.getTime() - a.getTime()) / MS_PER_DAY
}

/** Calendar months since birth (fractional), so a baby born on the 19th turns N months on the 19th. */
export function chronologicalMonths(birthday: string, now = new Date()): number {
  const b = parseDate(birthday)
  let months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth())
  let anchor = new Date(b.getFullYear(), b.getMonth() + months, b.getDate())
  if (anchor > now) {
    months--
    anchor = new Date(b.getFullYear(), b.getMonth() + months, b.getDate())
  }
  const next = new Date(b.getFullYear(), b.getMonth() + months + 1, b.getDate())
  return Math.max(0, months + daysBetween(anchor, now) / daysBetween(anchor, next))
}

/** Age used for development: corrected for prematurity until age 2. */
export function developmentalMonths(child: Pick<Child, 'birthday' | 'weeksEarly'>, now = new Date()): number {
  const chrono = chronologicalMonths(child.birthday, now)
  if (!child.weeksEarly || chrono >= 24) return chrono
  return Math.max(0, chrono - (child.weeksEarly * 7) / DAYS_PER_MONTH)
}

export function formatAge(months: number): string {
  if (months < 1) {
    const weeks = Math.floor(months * 4.345)
    return weeks <= 1 ? 'newborn' : `${weeks} weeks`
  }
  if (months < 24) {
    const whole = Math.floor(months)
    return `${whole} month${whole === 1 ? '' : 's'}`
  }
  const years = Math.floor(months / 12)
  const rem = Math.floor(months % 12)
  return rem ? `${years} yr ${rem} mo` : `${years} years`
}

/** Next CDC checkpoint at or after this age. */
export function nextCheckpoint(months: number): number {
  return CHECKPOINTS.find((c) => c >= months) ?? CHECKPOINTS[CHECKPOINTS.length - 1]
}

/** Checkpoints worth asking about for a child this age: two most recent plus the upcoming one. */
export function relevantCheckpoints(months: number): { earlier: number[]; relevant: number[] } {
  const past = CHECKPOINTS.filter((c) => c <= months)
  const upcoming = CHECKPOINTS.filter((c) => c > months).slice(0, 1)
  const recent = past.slice(-2)
  return {
    earlier: past.slice(0, Math.max(0, past.length - 2)),
    relevant: [...recent, ...upcoming],
  }
}
