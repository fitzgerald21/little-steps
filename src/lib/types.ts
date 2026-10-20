export type Domain = 'social' | 'language' | 'cognitive' | 'movement'

export interface Milestone {
  id: string
  /** CDC checkpoint age in months (2, 4, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60) */
  age: number
  domain: Domain
  text: string
}

export interface Activity {
  id: string
  title: string
  emoji: string
  domain: Domain
  /** Age window in months where this activity fits best */
  minAge: number
  maxAge: number
  minutes: number
  materials: string[]
  steps: string[]
  why: string
  /** Milestone ids this activity helps build */
  targets: string[]
  /** Milestone ids that should be met first (e.g. sitting, walking) */
  requires?: string[]
  easier?: string
  harder?: string
  safety?: string
}

export type Enjoyment = 'loved' | 'okay' | 'meh'
export type Challenge = 'easy' | 'right' | 'hard'

export interface LogEntry {
  id: string
  activityId: string
  date: string // ISO timestamp
  enjoyment: Enjoyment
  challenge: Challenge
  note?: string
  newMilestones?: string[]
}

export interface Child {
  id: string
  name: string
  birthday: string // YYYY-MM-DD
  weeksEarly: number
  /** milestone id -> ISO date it was marked met */
  milestones: Record<string, string>
  logs: LogEntry[]
  /** Activity ids skipped, with the date skipped */
  skips: Record<string, string>
  focus: Domain[]
  createdAt: string
}

export interface AppState {
  version: 1
  children: Child[]
  activeChildId: string | null
}
