import type { Domain, Milestone } from '../lib/types'

// Based on the CDC "Learn the Signs. Act Early." milestone checklists (2022 revision).
// Each checkpoint lists skills most children (75%+) show by that age.

export const DOMAINS: Record<Domain, { label: string; emoji: string; color: string }> = {
  social: { label: 'Social & emotional', emoji: '💛', color: 'var(--c-social)' },
  language: { label: 'Language', emoji: '💬', color: 'var(--c-language)' },
  cognitive: { label: 'Thinking & problem solving', emoji: '🧩', color: 'var(--c-cognitive)' },
  movement: { label: 'Movement', emoji: '🤸', color: 'var(--c-movement)' },
}

export const DOMAIN_ORDER: Domain[] = ['social', 'language', 'cognitive', 'movement']

export const CHECKPOINTS = [2, 4, 6, 9, 12, 15, 18, 24, 30, 36, 48, 60]

export function checkpointLabel(age: number): string {
  if (age < 24) return `${age} months`
  if (age === 30) return '2½ years'
  return `${age / 12} years`
}

const m = (age: number, domain: Domain, id: string, text: string): Milestone => ({ id, age, domain, text })

export const MILESTONES: Milestone[] = [
  // 2 months
  m(2, 'social', 'calms', 'Calms down when spoken to or picked up'),
  m(2, 'social', 'looks-face', 'Looks at your face'),
  m(2, 'social', 'happy-see-you', 'Seems happy to see you when you walk up'),
  m(2, 'social', 'social-smile', 'Smiles when you talk to or smile at them'),
  m(2, 'language', 'sounds', 'Makes sounds other than crying'),
  m(2, 'language', 'reacts-loud', 'Reacts to loud sounds'),
  m(2, 'cognitive', 'tracks-you', 'Watches you as you move'),
  m(2, 'cognitive', 'looks-toy', 'Looks at a toy for several seconds'),
  m(2, 'movement', 'head-tummy', 'Holds head up when on tummy'),
  m(2, 'movement', 'moves-limbs', 'Moves both arms and both legs'),
  m(2, 'movement', 'opens-hands', 'Opens hands briefly'),

  // 4 months
  m(4, 'social', 'smiles-attention', 'Smiles on their own to get your attention'),
  m(4, 'social', 'chuckles', 'Chuckles when you try to make them laugh'),
  m(4, 'social', 'seeks-attention', 'Looks at you, moves, or makes sounds to get or keep your attention'),
  m(4, 'language', 'coos', 'Makes cooing sounds like "oooo" and "aahh"'),
  m(4, 'language', 'sounds-back', 'Makes sounds back when you talk to them'),
  m(4, 'language', 'turns-to-voice', 'Turns head toward the sound of your voice'),
  m(4, 'cognitive', 'anticipates-feed', 'Opens mouth when they see breast or bottle if hungry'),
  m(4, 'cognitive', 'looks-hands', 'Looks at their hands with interest'),
  m(4, 'movement', 'head-steady', 'Holds head steady without support when held'),
  m(4, 'movement', 'holds-toy', 'Holds a toy when you put it in their hand'),
  m(4, 'movement', 'swings-at-toys', 'Uses an arm to swing at toys'),
  m(4, 'movement', 'hands-mouth', 'Brings hands to mouth'),
  m(4, 'movement', 'pushes-elbows', 'Pushes up onto elbows or forearms on tummy'),

  // 6 months
  m(6, 'social', 'knows-familiar', 'Knows familiar people'),
  m(6, 'social', 'likes-mirror', 'Likes to look at self in a mirror'),
  m(6, 'social', 'laughs', 'Laughs'),
  m(6, 'language', 'turn-taking-sounds', 'Takes turns making sounds with you'),
  m(6, 'language', 'raspberries', 'Blows "raspberries" (sticks tongue out and blows)'),
  m(6, 'language', 'squeals', 'Makes squealing noises'),
  m(6, 'cognitive', 'mouths-objects', 'Puts things in mouth to explore them'),
  m(6, 'cognitive', 'reaches-grab', 'Reaches to grab a toy they want'),
  m(6, 'cognitive', 'closes-lips', 'Closes lips to show they don’t want more food'),
  m(6, 'movement', 'rolls-tummy-back', 'Rolls from tummy to back'),
  m(6, 'movement', 'straight-arms', 'Pushes up with straight arms on tummy'),
  m(6, 'movement', 'leans-hands-sit', 'Leans on hands to support self when sitting'),

  // 9 months
  m(9, 'social', 'stranger-aware', 'Is shy, clingy, or fearful around strangers'),
  m(9, 'social', 'facial-expressions', 'Shows several facial expressions (happy, sad, angry, surprised)'),
  m(9, 'social', 'responds-name', 'Looks when you call their name'),
  m(9, 'social', 'reacts-leave', 'Reacts when you leave (looks, reaches for you, or cries)'),
  m(9, 'social', 'peekaboo', 'Smiles or laughs when you play peek-a-boo'),
  m(9, 'language', 'babbles', 'Babbles different sounds like "mamamama" and "babababa"'),
  m(9, 'language', 'arms-up', 'Lifts arms up to be picked up'),
  m(9, 'cognitive', 'object-permanence', 'Looks for objects when dropped out of sight'),
  m(9, 'cognitive', 'bangs-together', 'Bangs two things together'),
  m(9, 'movement', 'gets-to-sit', 'Gets to a sitting position by themself'),
  m(9, 'movement', 'hand-to-hand', 'Moves things from one hand to the other'),
  m(9, 'movement', 'rakes-food', 'Uses fingers to "rake" food toward themself'),
  m(9, 'movement', 'sits-unsupported', 'Sits without support'),

  // 12 months
  m(12, 'social', 'pat-a-cake', 'Plays games with you, like pat-a-cake'),
  m(12, 'language', 'waves-bye', 'Waves "bye-bye"'),
  m(12, 'language', 'mama-dada', 'Calls a parent "mama," "dada," or another special name'),
  m(12, 'language', 'understands-no', 'Understands "no" (pauses briefly or stops)'),
  m(12, 'cognitive', 'in-container', 'Puts something in a container, like a block in a cup'),
  m(12, 'cognitive', 'finds-hidden', 'Looks for things they see you hide, like a toy under a blanket'),
  m(12, 'movement', 'pulls-to-stand', 'Pulls up to stand'),
  m(12, 'movement', 'cruises', 'Walks while holding on to furniture'),
  m(12, 'movement', 'open-cup-held', 'Drinks from an open cup as you hold it'),
  m(12, 'movement', 'pincer', 'Picks things up between thumb and pointer finger'),

  // 15 months
  m(15, 'social', 'copies-children', 'Copies other children while playing'),
  m(15, 'social', 'shows-object', 'Shows you an object they like'),
  m(15, 'social', 'claps', 'Claps when excited'),
  m(15, 'social', 'hugs-toy', 'Hugs a stuffed toy or doll'),
  m(15, 'social', 'affection', 'Shows you affection (hugs, cuddles, or kisses)'),
  m(15, 'language', 'one-two-words', 'Tries to say one or two words besides "mama" or "dada"'),
  m(15, 'language', 'looks-named-object', 'Looks at a familiar object when you name it'),
  m(15, 'language', 'follows-gesture-direction', 'Follows directions given with a gesture and words'),
  m(15, 'language', 'points-ask', 'Points to ask for something or to get help'),
  m(15, 'cognitive', 'uses-things-right', 'Tries to use things the right way, like a phone, cup, or book'),
  m(15, 'cognitive', 'stacks-two', 'Stacks at least two small objects, like blocks'),
  m(15, 'movement', 'first-steps', 'Takes a few steps on their own'),
  m(15, 'movement', 'finger-feeds', 'Uses fingers to feed themself some food'),

  // 18 months
  m(18, 'social', 'explores-checks', 'Moves away from you but looks to make sure you’re close'),
  m(18, 'social', 'points-show', 'Points to show you something interesting'),
  m(18, 'social', 'hands-out-wash', 'Puts hands out for you to wash them'),
  m(18, 'social', 'looks-book', 'Looks at a few pages in a book with you'),
  m(18, 'social', 'helps-dress', 'Helps you dress them (pushes arm through sleeve, lifts foot)'),
  m(18, 'language', 'three-words', 'Tries to say three or more words besides "mama" or "dada"'),
  m(18, 'language', 'one-step-direction', 'Follows one-step directions without gestures'),
  m(18, 'cognitive', 'copies-chores', 'Copies you doing chores, like sweeping'),
  m(18, 'cognitive', 'simple-toy-play', 'Plays with toys in a simple way, like pushing a toy car'),
  m(18, 'movement', 'walks', 'Walks without holding on to anyone or anything'),
  m(18, 'movement', 'scribbles', 'Scribbles'),
  m(18, 'movement', 'open-cup', 'Drinks from an open cup (may spill sometimes)'),
  m(18, 'movement', 'feeds-fingers', 'Feeds themself with their fingers'),
  m(18, 'movement', 'tries-spoon', 'Tries to use a spoon'),
  m(18, 'movement', 'climbs-couch', 'Climbs on and off a couch or chair without help'),

  // 2 years
  m(24, 'social', 'notices-upset', 'Notices when others are hurt or upset'),
  m(24, 'social', 'social-referencing', 'Looks at your face to see how to react in a new situation'),
  m(24, 'language', 'points-book', 'Points to things in a book when you ask'),
  m(24, 'language', 'two-words', 'Says at least two words together, like "More milk"'),
  m(24, 'language', 'body-parts', 'Points to at least two body parts when you ask'),
  m(24, 'language', 'more-gestures', 'Uses gestures beyond waving and pointing, like blowing a kiss or nodding'),
  m(24, 'cognitive', 'two-hands-different', 'Holds something in one hand while using the other'),
  m(24, 'cognitive', 'buttons-knobs', 'Tries to use switches, knobs, or buttons on a toy'),
  m(24, 'cognitive', 'multiple-toys', 'Plays with more than one toy at the same time'),
  m(24, 'movement', 'kicks-ball', 'Kicks a ball'),
  m(24, 'movement', 'runs', 'Runs'),
  m(24, 'movement', 'walks-stairs', 'Walks (not climbs) up a few stairs, with or without help'),
  m(24, 'movement', 'eats-spoon', 'Eats with a spoon'),

  // 30 months
  m(30, 'social', 'parallel-play', 'Plays next to other children and sometimes with them'),
  m(30, 'social', 'look-at-me', 'Shows you what they can do by saying "Look at me!"'),
  m(30, 'social', 'follows-routines', 'Follows simple routines when told, like clean-up time'),
  m(30, 'language', 'fifty-words', 'Says about 50 words'),
  m(30, 'language', 'action-phrase', 'Says two or more words with an action word, like "Doggie run"'),
  m(30, 'language', 'names-book-things', 'Names things in a book when you point and ask "What is this?"'),
  m(30, 'language', 'pronouns', 'Says words like "I," "me," or "we"'),
  m(30, 'cognitive', 'pretend-objects', 'Uses things to pretend, like feeding a block to a doll'),
  m(30, 'cognitive', 'problem-solves', 'Shows simple problem solving, like using a stool to reach something'),
  m(30, 'cognitive', 'two-step-direction', 'Follows two-step instructions like "Put the toy down and close the door"'),
  m(30, 'cognitive', 'knows-color', 'Shows they know at least one color'),
  m(30, 'movement', 'twists', 'Uses hands to twist things, like doorknobs or lids'),
  m(30, 'movement', 'undresses', 'Takes some clothes off by themself'),
  m(30, 'movement', 'jumps', 'Jumps off the ground with both feet'),
  m(30, 'movement', 'turns-pages', 'Turns book pages one at a time'),

  // 3 years
  m(36, 'social', 'calms-separation', 'Calms down within 10 minutes after you leave'),
  m(36, 'social', 'joins-play', 'Notices other children and joins them to play'),
  m(36, 'language', 'conversation-two', 'Has conversations with at least two back-and-forth exchanges'),
  m(36, 'language', 'wh-questions', 'Asks "who," "what," "where," or "why" questions'),
  m(36, 'language', 'describes-action', 'Says what action is happening in a picture or book'),
  m(36, 'language', 'says-name', 'Says their first name when asked'),
  m(36, 'language', 'understandable', 'Talks well enough for others to understand most of the time'),
  m(36, 'cognitive', 'draws-circle', 'Draws a circle when you show them how'),
  m(36, 'cognitive', 'heeds-hot', 'Avoids touching hot things when you warn them'),
  m(36, 'movement', 'strings-beads', 'Strings items together, like large beads or macaroni'),
  m(36, 'movement', 'dresses-some', 'Puts on some clothes by themself, like loose pants or a jacket'),
  m(36, 'movement', 'uses-fork', 'Uses a fork'),

  // 4 years
  m(48, 'social', 'role-play', 'Pretends to be something else during play (teacher, superhero, dog)'),
  m(48, 'social', 'seeks-playmates', 'Asks to go play with children if none are around'),
  m(48, 'social', 'comforts', 'Comforts others who are hurt or sad'),
  m(48, 'social', 'avoids-danger', 'Avoids danger, like not jumping from tall heights'),
  m(48, 'social', 'likes-helping', 'Likes to be a "helper"'),
  m(48, 'social', 'adapts-setting', 'Changes behavior based on where they are (library vs. playground)'),
  m(48, 'language', 'four-word-sentences', 'Says sentences with four or more words'),
  m(48, 'language', 'song-words', 'Says some words from a song, story, or nursery rhyme'),
  m(48, 'language', 'tells-day', 'Talks about at least one thing that happened during their day'),
  m(48, 'language', 'answers-what-for', 'Answers simple questions like "What is a coat for?"'),
  m(48, 'cognitive', 'names-colors', 'Names a few colors of items'),
  m(48, 'cognitive', 'predicts-story', 'Tells what comes next in a well-known story'),
  m(48, 'cognitive', 'draws-person', 'Draws a person with three or more body parts'),
  m(48, 'movement', 'catches-ball', 'Catches a large ball most of the time'),
  m(48, 'movement', 'pours', 'Serves themself food or pours water, with supervision'),
  m(48, 'movement', 'unbuttons', 'Unbuttons some buttons'),
  m(48, 'movement', 'tripod-grip', 'Holds a crayon between fingers and thumb (not a fist)'),

  // 5 years
  m(60, 'social', 'takes-turns', 'Follows rules or takes turns when playing games with others'),
  m(60, 'social', 'performs', 'Sings, dances, or acts for you'),
  m(60, 'social', 'simple-chores', 'Does simple chores, like matching socks or clearing the table'),
  m(60, 'language', 'tells-story', 'Tells a story they heard or made up with at least two events'),
  m(60, 'language', 'story-questions', 'Answers simple questions about a book or story'),
  m(60, 'language', 'conversation-three', 'Keeps a conversation going with more than three exchanges'),
  m(60, 'language', 'rhymes', 'Uses or recognizes simple rhymes (bat–cat, ball–tall)'),
  m(60, 'cognitive', 'counts-ten', 'Counts to 10'),
  m(60, 'cognitive', 'names-numbers', 'Names some numbers between 1 and 5 when you point to them'),
  m(60, 'cognitive', 'time-words', 'Uses time words like "yesterday," "tomorrow," "morning," or "night"'),
  m(60, 'cognitive', 'attention-span', 'Pays attention for 5 to 10 minutes during activities'),
  m(60, 'cognitive', 'writes-letters', 'Writes some letters in their name'),
  m(60, 'cognitive', 'names-letters', 'Names some letters when you point to them'),
  m(60, 'movement', 'buttons', 'Buttons some buttons'),
  m(60, 'movement', 'hops', 'Hops on one foot'),
]

export const MILESTONE_BY_ID: Record<string, Milestone> = Object.fromEntries(MILESTONES.map((x) => [x.id, x]))
