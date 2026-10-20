# 👣 Little Steps

Daily, developmentally appropriate play ideas for your baby or toddler (0–5 years), tailored to the milestones they've already reached and how past activities went.

**Live app:** https://fitzgerald21.github.io/little-steps/

## How it works

1. **Set up:** enter your child's name and birthday (with an adjustment for premature birth), then tick off the milestones they've already met.
2. **Get today's activity:** the app picks one activity based on age, emerging skills, and what you've done recently, plus a few alternates.
3. **Log how it went:** rate enjoyment (😍 / 🙂 / 😕) and challenge (too easy / just right / too hard), and mark any new skills you noticed.
4. **It adapts:** "too easy" pushes suggestions in that area a little ahead of their age, "too hard" pulls them back, favorites come around again, and areas you haven't played in lately get a boost.

## The recommendation engine

[`src/lib/engine.ts`](src/lib/engine.ts) scores every activity in the library:

| Signal | Effect |
| --- | --- |
| Targets an unmet milestone at or just above their age | Strong boost |
| Age fits the activity window, shifted per domain by challenge feedback | Boost |
| Required milestones (e.g. walking) not met yet | Excluded |
| Previously loved / disliked | Up / down |
| Done in the last few days, or skipped | Down |
| Domain under-played this week, or a chosen focus area | Boost |
| Small daily-seeded jitter | Keeps picks fresh but stable for the day |

## Content

- **Milestones** ([`src/data/milestones.ts`](src/data/milestones.ts)) are adapted from the CDC's [Learn the Signs. Act Early.](https://www.cdc.gov/ncbddd/actearly/milestones/index.html) checklists (2022 revision), from 2 months to 5 years.
- **Activities** ([`src/data/activities.ts`](src/data/activities.ts)) each list an age window, materials, steps, the milestones they build, prerequisites, easier/harder variations, and safety notes.

Run `npm run check` after editing content. It validates ids and lists milestones that no activity covers yet.

## Privacy & data

There are no accounts and no server. Everything is stored in the browser's `localStorage` on your device. Use **Profile → Backup** to export or import a JSON file (for example, to move to a new phone).

## Development

```bash
npm install
npm run dev      # local dev server
npm run check    # validate activity/milestone data
npm run build    # production build into dist/
```

Pushing to `main` deploys to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

On a phone, open the site and use **Share → Add to Home Screen** (iOS) or **Install app** (Android) to get a full-screen app that works offline.

---

*Little Steps offers play ideas, not medical advice. If you have concerns about your child's development, talk to their doctor.*
