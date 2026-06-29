// Global state variables
let quizData = {};         // Store full JSON data loaded from file
let subject = "";          // Current quiz subject
let levelData = {};        // Data for the selected category
let currentQuestions = []; // List of questions for the current quiz
let currentQuestionIndex = 0; // Track which question the user is on
let score = 0;             // User's score
let timer;                 // Reference to the question countdown interval
let advanceTimer;          // Reference to the auto-advance-after-answer timeout
let timeLimit = 10;        // Default time limit per question

const AUTO_ADVANCE_DELAY_MS = 8000;

// Static SVG icons used in place of emoji for feedback states
const ICONS = {
  correct: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2.5"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  incorrect: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2.5"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  timeout: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f39c12" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  trophy: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" stroke-width="1.6"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M7 5H4a2 2 0 0 0 0 4h1M17 5h3a2 2 0 0 1 0 4h-1" stroke-linecap="round"/></svg>`,
};

// Start quiz by loading data (bundled in questions-data.js as window.QUIZ_DATA,
// so this works whether the page is opened directly or served over http)
// and displaying category selection
function startQuiz(selectedSubject) {
  subject = selectedSubject;
  const data = window.QUIZ_DATA?.[subject];
  if (!data) {
    console.error("No quiz data found for subject:", subject);
    alert("Could not load the quiz. Please try again later.");
    return;
  }
  quizData = data;
  showCategory(subject); // Show quiz categories
  openModal();            // Open modal dialog
}

// Show list of categories from the quiz JSON
function showCategory(selectedSubject) {
  subject = selectedSubject;

  // Clear any existing modal content
  const categoryEl = document.getElementById("category");
  document.getElementById("levels").innerHTML = "";
  document.getElementById("questions").innerHTML = "";
  categoryEl.innerHTML = "";

  // Build category buttons via DOM APIs (avoids HTML/script injection from JSON content)
  for (const cat of Object.keys(quizData)) {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.textContent = cat;
    btn.addEventListener("click", () => selectCategory(cat));
    categoryEl.appendChild(btn);
  }

  document.getElementById("quizTitle").textContent = `Quiz: ${subject}`;
}

// When a category is selected, show the difficulty levels
function selectCategory(cat) {
  const categoryEl = document.getElementById("category");
  const levelsEl = document.getElementById("levels");
  categoryEl.innerHTML = "";
  levelsEl.innerHTML = "";

  levelData = quizData[cat] || {};

  for (const key of Object.keys(levelData.levels || {})) {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.textContent = key;
    btn.addEventListener("click", () => selectLevels(key));
    levelsEl.appendChild(btn);
  }

  const backBtn = document.createElement("button");
  backBtn.className = "option-button";
  backBtn.textContent = "Back to Category";
  backBtn.addEventListener("click", () => showCategory(subject));
  levelsEl.appendChild(backBtn);

  document.getElementById("quizTitle").textContent = `Quiz: ${subject}`;
}

// When a level is selected, show the questions
function selectLevels(level) {
  document.getElementById("levels").innerHTML = "";
  score = 0;
  clearInterval(timer);
  clearTimeout(advanceTimer);

  const questions = levelData?.levels?.[level];

  // Set time limit based on difficulty
  if (level === "Easy") {
    timeLimit = 20;
  } else if (level === "Medium") {
    timeLimit = 30;
  } else if (level === "Hard") {
    timeLimit = 160;
  } else {
    timeLimit = 250; // Custom or 'Very Hard'
  }

  // If no questions found, alert and exit
  if (!Array.isArray(questions) || questions.length === 0) {
    alert("No questions available for this level.");
    return;
  }

  currentQuestions = questions;
  currentQuestionIndex = 0;

  showQuestion(); // Show the first question
}

// Display the current question
function showQuestion() {
  const questionObj = currentQuestions[currentQuestionIndex];
  const modalContent = document.getElementById("questions");
  modalContent.innerHTML = "";

  const block = document.createElement("div");
  block.className = "question-block";

  const progress = document.createElement("p");
  progress.className = "question-progress";
  progress.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
  block.appendChild(progress);

  const timerEl = document.createElement("div");
  timerEl.className = "question-timer";
  timerEl.innerHTML = `Time left: <span id="timeLeft">${timeLimit}</span>s`;
  block.appendChild(timerEl);

  const timerTrack = document.createElement("div");
  timerTrack.className = "timer-bar-track";
  const timerFill = document.createElement("div");
  timerFill.className = "timer-bar-fill";
  timerFill.id = "timerFill";
  timerFill.style.width = "100%";
  timerTrack.appendChild(timerFill);
  block.appendChild(timerTrack);

  const questionText = document.createElement("p");
  questionText.className = "question";
  questionText.textContent = questionObj.question;
  block.appendChild(questionText);

  const optionsEl = document.createElement("div");
  optionsEl.id = "answer-options";
  questionObj.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = "option-button answer-button";
    btn.textContent = opt;
    btn.addEventListener("click", () => checkAnswer(index));
    optionsEl.appendChild(btn);
  });
  block.appendChild(optionsEl);

  modalContent.appendChild(block);

  startTimer();
}

// Timer logic for each question, including the animated progress bar
function startTimer() {
  let timeRemaining = timeLimit;
  const timeElement = document.getElementById("timeLeft");
  const fillElement = document.getElementById("timerFill");

  timer = setInterval(() => {
    timeRemaining--;
    if (timeElement) timeElement.textContent = timeRemaining;
    if (fillElement) {
      const percent = Math.max(0, (timeRemaining / timeLimit) * 100);
      fillElement.style.width = `${percent}%`;
      fillElement.classList.toggle("low-time", percent <= 25);
    }
    if (timeRemaining <= 0) {
      clearInterval(timer);
      checkAnswer(null); // No answer selected (timeout)
    }
  }, 1000);
}

// Check the selected answer (by option index) and show result
function checkAnswer(selectedIndex) {
  clearInterval(timer);

  const modalContent = document.getElementById("questions");
  const questionObj = currentQuestions[currentQuestionIndex];
  const correctIndex = questionObj.options.indexOf(questionObj.answer);
  const selectedOption = selectedIndex === null ? null : questionObj.options[selectedIndex];

  // Disable all answer buttons and highlight correct/selected answers
  const buttons = modalContent.querySelectorAll(".answer-button");
  buttons.forEach((btn, index) => {
    btn.disabled = true;
    if (index === correctIndex) {
      btn.classList.add("correct");
    } else if (index === selectedIndex) {
      btn.classList.add("incorrect");
    }
  });

  const feedback = document.createElement("div");
  feedback.id = "answer-text";

  const heading = document.createElement("h3");
  if (selectedOption === questionObj.answer) {
    score++;
    heading.innerHTML = `${ICONS.correct} Correct answer: ${questionObj.answer}`;
  } else if (selectedIndex === null) {
    heading.innerHTML = `${ICONS.timeout} Time's up! Correct answer: ${questionObj.answer}`;
  } else {
    heading.innerHTML = `${ICONS.incorrect} Incorrect. Correct answer: ${questionObj.answer}`;
  }
  feedback.appendChild(heading);

  const fact = questionObj.fun_fact || questionObj.explanation;
  if (fact) {
    const factEl = document.createElement("p");
    factEl.textContent = fact;
    feedback.appendChild(factEl);
  }

  const isLastQuestion = currentQuestionIndex + 1 >= currentQuestions.length;
  const nextBtn = document.createElement("button");
  nextBtn.className = "option-button";
  nextBtn.textContent = isLastQuestion ? "See Results" : "Next Question";
  nextBtn.addEventListener("click", () => {
    clearTimeout(advanceTimer);
    nextQuestion();
  });
  feedback.appendChild(nextBtn);

  modalContent.appendChild(feedback);

  // Auto-advance if the user doesn't click Next, but they can skip ahead any time
  advanceTimer = setTimeout(nextQuestion, AUTO_ADVANCE_DELAY_MS);
}

// Go to next question or end quiz
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length) {
    showQuestion();
  } else {
    showQuizEnd();
  }
}

// Show final score and restart options
function showQuizEnd() {
  const modalContent = document.getElementById("questions");
  modalContent.innerHTML = "";

  const container = document.createElement("div");
  container.className = "end-quiz";
  container.innerHTML = ICONS.trophy;

  const heading = document.createElement("h3");
  heading.textContent = "Quiz Completed!";
  container.appendChild(heading);

  const scoreText = document.createElement("p");
  const scoreStrong = document.createElement("strong");
  scoreStrong.textContent = String(score);
  scoreText.append("Your Score: ", scoreStrong, ` / ${currentQuestions.length}`);
  container.appendChild(scoreText);

  const backBtn = document.createElement("button");
  backBtn.className = "option-button";
  backBtn.textContent = "Back to Category";
  backBtn.addEventListener("click", () => showCategory(subject));
  container.appendChild(backBtn);

  modalContent.appendChild(container);
  document.getElementById("quizTitle").textContent = "Quiz Finished";
}

// Close modal and reset state
function closeModal() {
  const modal = document.getElementById("quizModal");
  modal.classList.remove("is-open");
  modal.style.display = "none";
  document.getElementById("category").innerHTML = "";
  document.getElementById("levels").innerHTML = "";
  document.getElementById("questions").innerHTML = "";

  currentQuestions = [];
  currentQuestionIndex = 0;
  score = 0;

  clearInterval(timer);
  clearTimeout(advanceTimer);
}

// Open the modal
function openModal() {
  const modal = document.getElementById("quizModal");
  modal.style.display = "block";
  modal.classList.add("is-open");
}

// Close modal if user clicks outside the content box
window.onclick = function (event) {
  const modal = document.getElementById("quizModal");
  if (event.target === modal) {
    closeModal();
  }
};

// Close modal with the Escape key
window.addEventListener("keydown", (event) => {
  const modal = document.getElementById("quizModal");
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

// Allow category cards to be activated with the keyboard (Enter/Space)
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.click();
    }
  });
});
