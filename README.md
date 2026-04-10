# Einbürgerungstest Kanton Zürich

A mobile-first React study app for the official Swiss citizenship test (Kanton Zürich). Covers all 347 official questions across five topics, with an adaptive study queue, timed exam mode, XP/level progression, streaks, and badges.

---

## Architecture

The project follows a modular, single-responsibility structure:

```
src/
├── main.jsx                   # ReactDOM entry point
├── App.jsx                    # Root: all app state + screen router
│
├── data/
│   ├── questions.json         # 347 raw questions (id, question, options, answer, brochure pages)
│   ├── topics.js              # Topic config: emoji, color, brochure chapter
│   ├── brochureContext.js     # Key facts per brochure page range + getBrochureContent()
│   ├── badges.js              # Badge definitions (key, label, icon, description)
│   └── constants.js           # Numeric/config constants (XP values, exam params)
│
├── utils/
│   ├── study.js               # QUESTIONS transform from JSON, shuffleArray, getStudyQueue
│   └── gamification.js        # getLevel, getLevelProgress, checkBadges
│
└── components/
    ├── shared/
    │   ├── SwissCross.jsx     # Swiss flag SVG icon
    │   ├── ProgressRing.jsx   # Circular SVG progress indicator
    │   └── BrochureViewer.jsx # Bottom-sheet modal: brochure context for a question
    ├── LandingScreen.jsx      # Hero + CTA (Google / Guest login)
    ├── OnboardingScreen.jsx   # Daily goal selection
    ├── DashboardScreen.jsx    # Stats, topic progress, action buttons, badges preview
    ├── StudyScreen.jsx        # Dynamic-queue question cards with hint/brochure access
    ├── ExamScreen.jsx         # Timed 30-question exam with topic breakdown results
    └── BadgesScreen.jsx       # Achievement gallery
```

### Data flow

`App.jsx` owns the entire application state (`progress`, `streak`, `badges`, `examSessions`) and passes it down as props. Screens communicate upward via callback props (`onAnswer`, `onExamDone`, `onStudy`, etc.). No external state library is used.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build       # outputs to dist/
npm run preview     # preview the production build locally
```

---

## Study queue

Each study session (full set or single category) starts with all questions in a random order. The queue then adapts dynamically as you answer:

- **Correct answer** — the question moves to the end of the queue. It will appear again at the end of the session for a final review pass, and is permanently removed once answered correctly a second time.
- **Wrong answer** — the question is removed from the front and re-inserted three positions back, so it reappears soon for another attempt.

The session ends when every question has been answered correctly at least once. The summary screen shows your overall accuracy (correct answers / total attempts) and the number of retries needed, giving a clear picture of how much repetition the session required.

## Topics

| Topic | Questions | Brochure pages |
|---|---|---|
| 🏛️ Demokratie & Föderalismus | ~100 | 14–25 |
| 🤝 Sozialstaat & Zivilgesellschaft | ~80 | 26–39 |
| 📜 Geschichte | ~60 | 6–13 |
| 🏔️ Geografie | ~50 | 46–53 |
| 🎭 Kultur & Alltagskultur | ~57 | 40–45 |

## Exam rules

- 30 random questions, 45-minute time limit
- Pass mark: 60% (18/30 correct)
- No hints or brochure access during exam
