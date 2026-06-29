# Interactive Quiz App

A colorful, animated React quiz app covering 12 subjects (Science, History, Geography, Literature, Math, Sports, Technology, Movies, Music, Art, Animals, and Space). Pick a subject, a category, and a difficulty, then answer timed multiple-choice questions. Correct streaks earn confetti, sound effects (synthesized in-browser, no audio files), and after every answer two illustrated bots chat about a fun fact related to the question.

## Features

- 12 subjects, each with several categories and difficulty levels (Easy/Medium/Hard, plus Very Hard for Math)
- Animated, color-themed cards on the home screen, each with its own idle motion (spinning atom, bouncing ball, twinkling planet, etc.) - all drawn in CSS/SVG, no image files
- Timed questions with an animated countdown bar
- Streak tracking with a flame badge, and confetti bursts on hot streaks and strong finishes
- Two animated bot characters that discuss a fun fact after every answer
- Sound effects generated with the Web Audio API (click, correct, incorrect, fanfare) with a mute toggle that persists across visits
- Animated progress dots and a counting-up score reveal at the end of each quiz

## Tech stack

- React 18 + Vite
- Plain CSS (no UI framework) - all animation is hand-written CSS keyframes
- Quiz content lives in `questions/*.json` and is bundled at build time via Vite's native JSON imports (no `fetch()`, so nothing breaks under restrictive setups)

## Project structure

```
InteractiveQuiz/
├── index.html                 # Vite entry point
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── CategoryGrid.jsx
│   │   ├── SubjectCard.jsx
│   │   ├── QuizModal.jsx      # categories -> levels -> questions -> end
│   │   ├── BotConversation.jsx
│   │   ├── ProgressDots.jsx
│   │   ├── AnimatedScore.jsx
│   │   ├── Confetti.jsx
│   │   └── icons/             # subject icons, feedback icons, bot avatars
│   ├── hooks/
│   │   └── useSound.js        # Web Audio API sound effects + mute toggle
│   ├── data/
│   │   └── quizData.js        # imports and aggregates questions/*.json
│   └── styles/
│       └── index.css
├── questions/                  # one JSON file per subject - the source of truth for quiz content
└── .github/workflows/deploy.yml
```

## Quiz data format

Each file in `questions/` is one subject, structured as categories -> difficulty levels -> questions:

```json
{
  "Algebra": {
    "levels": {
      "Easy": [
        {
          "question": "What is 2 + 2?",
          "options": ["3", "4", "5", "6"],
          "answer": "4",
          "explanation": "Basic addition shows 2 + 2 = 4.",
          "fun_fact": "Did you know? In binary, 2 + 2 is 100!"
        }
      ]
    }
  }
}
```

`answer` must exactly match one of the strings in `options`. Either `fun_fact` or `explanation` (or both) is used by the bot conversation feature after each answer.

## Getting started

```bash
npm install
npm run dev      # local dev server with hot reload
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

After editing any file in `questions/`, just restart/reload - Vite picks up JSON changes automatically in dev, and `npm run build` re-bundles them for production.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` to GitHub Pages automatically. In the repo's Settings -> Pages, the build/deployment source must be set to "GitHub Actions" (not "Deploy from a branch") for this to take effect.

`vite.config.js` sets `base: "/InteractiveQuiz/"` to match the GitHub Pages project URL (`https://sripradha17.github.io/InteractiveQuiz/`). Update this if the repo is renamed or moved to a custom domain.

## License

MIT License - feel free to use, modify, and share.

## Credits

Developed by Sripradha Vittal Bhat.
