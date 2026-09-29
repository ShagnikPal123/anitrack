# AniTrack

A personal **anime, manga & light novel tracker** with a dark, glassy dashboard
inspired by modern fitness apps. Track what you watch and read, link
adaptations together into franchises, get suggestions, plan with a calendar,
and study your habits with statistics — all in one static site.

🌐 **Live site:** https://ShagnikPal123.github.io/anitrack/
*(enable GitHub Pages on this repo: Settings → Pages → Deploy from a branch → `main`)*

No accounts, no servers, no build step. Your data lives in your browser.

---

## Features

### 🏠 Home dashboard
- Time-aware greeting with your display name, global library search, and a
  notification bell counting today's episode releases.
- Stat cards with sparklines: **Episodes Watched, Chapters Read, Pages Read,
  Day Streak**.
- **Activity Tracking** chart (weekly/monthly) of episodes + chapters per day.
- **Continue Watching/Reading** cards with cover art and progress badges.
- A **daily quote** that changes every day (30 bundled anime/manga quotes).

### 📺 Media tabs — Anime, Manga, Light Novels
- Cover grid with status pills, progress bars, star ratings, and quick
  **+ / −** progress steppers right on the card.
- Filter by status, sort (title, rating, progress, recently updated), and
  in-tab search.
- Click any entry for a detail drawer: synopsis, status selector
  (Watching / Completed / On Hold / Dropped / Plan to Watch — Reading
  variants for manga/LN), progress stepper with totals **auto-filled from
  AniList** (never guessed), 0–10 score, autosaving notes, per-entry site
  links, and **Related media** (source, adaptation, prequel, sequel) with
  one-click Add.
- Every title is **validated against AniList**, so pasted/typo'd names get
  corrected to the real title.

### ➕ Global add button
- Floating **+** opens a search modal powered by AniList (debounced).
- **Multi-select** results with checkboxes; per-result type selector
  (Anime / Manga / Light Novel, auto-detected but changeable).
- Context-aware: opened from the Anime tab, it defaults to anime.
- After adding, it offers to also add **related media** (e.g. the manga
  source or anime adaptation) with checkboxes.

### 🔗 Franchise tab
- Entries linked through AniList relations are grouped into **franchises**.
- Each group shows a cover collage, per-type progress, a combined progress
  bar, and **"missing pieces"** suggestions (e.g. *"Light novel source not
  tracked — Add"*).

### ✨ Suggestions tab
- Seed from your library ("Because you watched X…") using AniList
  recommendations with reason text, or browse by genre. Every card has an
  Add button.

### 💬 AI Chat tab
- An on-device, rule-based helper (clearly labeled — not a cloud AI model).
- Handles: *"recommend something like X"*, *"what's airing this week"*,
  *"what should I avoid"*, *"add X to my list"* (stages an add
  confirmation), plus quick-prompt chips.

### 📅 Calendar tab
- Month view with two toggleable layers:
  1. **Releases** — next-episode air dates for your tracked anime (30 days,
     from AniList).
  2. **My Schedule** — your own watch/read reminders with weekly repeat.
- Click a day for details; **Export .ics** per event or per layer to import
  into Apple or Google Calendar.

### 📊 Statistics tab
- Hand-drawn canvas charts (no chart library): totals row, 14-day activity
  bars, status donut, score histogram, top genres, and a 12-week activity
  heatmap — all from your library plus a timestamped activity log.

### 🔖 Links tab
- Save sites (name + URL + **general site** toggle). General sites appear as
  quick-launch chips in every entry drawer.

### 🎨 Settings tab
- Display name, 6 accent color presets, **custom accent via color wheel +
  hex input**, 4 background gradients + custom image URL.
- **JSON export/import** (migrate between devices), local profile switcher
  (create / rename / switch / delete — device-local), and a reset-all
  danger zone.

---

## Tech

- **Vanilla HTML + CSS + JS** — no frameworks, no npm, no build step.
- **AniList GraphQL API** (`https://graphql.anilist.co`) for search, titles,
  episode/chapter counts, cover art, relations, recommendations, and airing
  schedules. The app degrades gracefully offline.
- **localStorage** (`anitrack.v1`, per profile) for all persistence.
- Charts are hand-drawn on `<canvas>`; icons are inline SVG (no emoji icons).

## Run it

Just open `index.html` in a browser, or serve the folder:

```bash
cd anitrack
python3 -m http.server 8080
# → http://localhost:8080
```

Internet access is needed for AniList data (search, covers, episode counts).

## Project structure

```
anitrack/
├── index.html   # App shell: sidebar, header, tabs, modals, drawer
├── styles.css   # Theme system (CSS variables), layout, responsive design
├── app.js       # All logic: state, AniList client, tabs, charts, calendar
├── README.md
├── LICENSE
└── .gitignore
```

## Notes & limitations

- **Profiles are device-local**, not cloud accounts — real Apple/Google login
  isn't possible on a static site.
- **Calendar sync is one-way** via `.ics` export/import (a static page can't
  write to Apple/Google Calendar directly).
- The in-app "AI chat" is a local rule-based helper, not a language model.
- Data persists per browser via localStorage; use **Settings → Export** to
  back up or move your library.

## License

MIT — see [LICENSE](LICENSE).
