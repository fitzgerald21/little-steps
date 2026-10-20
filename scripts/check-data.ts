// Sanity checks for the activity library: run with `npm run check`.
import { ACTIVITIES } from '../src/data/activities.ts'
import { MILESTONE_BY_ID, MILESTONES } from '../src/data/milestones.ts'

const errors: string[] = []
const ids = new Set<string>()

for (const m of MILESTONES) {
  if (ids.has(m.id)) errors.push(`duplicate milestone id: ${m.id}`)
  ids.add(m.id)
}

const actIds = new Set<string>()
for (const a of ACTIVITIES) {
  if (actIds.has(a.id)) errors.push(`duplicate activity id: ${a.id}`)
  actIds.add(a.id)
  if (a.minAge > a.maxAge) errors.push(`${a.id}: minAge > maxAge`)
  for (const t of [...a.targets, ...(a.requires ?? [])]) {
    if (!MILESTONE_BY_ID[t]) errors.push(`${a.id}: unknown milestone "${t}"`)
  }
}

// Every milestone should be worked on by at least one activity
const covered = new Set(ACTIVITIES.flatMap((a) => a.targets))
const uncovered = MILESTONES.filter((m) => !covered.has(m.id))

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(`✓ ${MILESTONES.length} milestones, ${ACTIVITIES.length} activities`)
if (uncovered.length) console.log(`  ${uncovered.length} milestones with no activity: ${uncovered.map((m) => m.id).join(', ')}`)
