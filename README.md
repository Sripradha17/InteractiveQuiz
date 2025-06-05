
# 🧠 Interactive Quiz App

An engaging, dynamic, and educational web-based quiz application built using vanilla JavaScript, HTML, and CSS. This app allows users to select a subject, choose a category within that subject, pick a difficulty level, and answer a series of timed multiple-choice questions. Scores are tracked, and fun facts or explanations are displayed after each question.

---

## 🚀 Features

- 🎯 **Multiple Subjects**: Quiz data is loaded per subject (e.g., `Math`, `Science`, etc.)
- 📂 **Category Selection**: Subjects contain multiple categories (e.g., `Algebra`, `Geometry`, etc.)
- 📊 **Difficulty Levels**: Each category includes multiple difficulty levels like Easy, Medium, Hard, and Very Hard.
- ⏳ **Timed Questions**: Each question has a countdown timer based on its difficulty.
- ✅ **Answer Feedback**: Instant feedback with correct answer and a fun fact or explanation.
- 🏁 **Final Score Summary**: Score is displayed at the end of the quiz.
- 🧼 **Clean UI**: Modal-based UI keeps the experience focused and distraction-free.
- 🔁 **Retry Option**: Users can go back and reselect categories or levels after finishing a quiz.

---

## 📁 Project Structure

```
InteractiveQuiz/
│
├── main/interactiveQuiz.html               # Main HTML file
├── main/style.css                # Styling for the quiz UI
├── main/script.js                # Core quiz logic
└── questions/
    ├── math.json            # Example quiz data file
    ├── science.json         # Add more subjects as needed
    └── ...
└── images/ #gifs for each category


```

---

## 🛠️ How It Works

### 1. Load a Subject

The quiz starts when a subject button is clicked. It fetches the corresponding JSON file from the `/questions/` directory:

```javascript
fetch(\`../questions/\${subject}.json\`)
```

---

### 2. Choose a Category

Each subject JSON is structured with categories (e.g., `Algebra`, `Geometry`), which the user selects next.

```json
{
  "Algebra": {
    "levels": {
      "Easy": [...],
      "Medium": [...],
      "Hard": [...]
    }
  }
}
```

---

### 3. Pick a Difficulty Level

After selecting a category, the user picks a difficulty (Easy, Medium, Hard, Very Hard), which adjusts the question timer:

```javascript
if (level === "Easy") timeLimit = 10;
else if (level === "Medium") timeLimit = 20;
// ...
```

---

### 4. Answer Questions

Questions are displayed one at a time with multiple-choice options. The timer counts down, and feedback is provided after answering:

- ✅ Correct answer: green
- ❌ Wrong answer: red
- ⏰ Time’s up: feedback shown

Fun facts or explanations are displayed if available.

---

### 5. Quiz Completion

At the end of the quiz, a summary modal shows the user’s final score and a button to return to the category selection.

---

## 📦 Sample JSON Format

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

---

## 🧪 Live Demo

> *(Include link here if hosted online using GitHub Pages, Vercel, Netlify, etc.)*

---

## 📋 To-Do / Future Enhancements

- [ ] Add user authentication
- [ ] Store scores and progress
- [ ] Leaderboards
- [ ] Sound effects
- [ ] Visual timer progress bar
- [ ] Mobile responsiveness improvements

---

## 🧑‍💻 Getting Started

1. **Clone this repo**
2. Place your quiz JSON files in the `questions/` folder
3. Open `index.html` in your browser or use a local server
4. Start playing!

---

## 📄 License

MIT License – feel free to use, modify, and share!

---

## 🙌 Credits

Developed by Sripradha Vittal Bhat  
Icons and emojis via [EmojiCopy](https://emojicopy.com/)  
