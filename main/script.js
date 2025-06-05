// Global state variables
let quizData = {};         // Store full JSON data loaded from file
let subject = "";          // Current quiz subject
let levelData = {};        // Data for the selected category
let currentQuestions = []; // List of questions for the current quiz
let currentQuestionIndex = 0; // Track which question the user is on
let score = 0;             // User's score
let timer;                 // Reference to the timer interval
let timeLimit = 10;        // Default time limit per question

// Start quiz by loading data and displaying category selection
async function startQuiz(subject) {
  try {
    const response = await fetch(`../questions/${subject}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${subject}.json`);
    }
    quizData = await response.json(); // Parse JSON
    await showCategory(subject);      // Show quiz categories
    await openModal();                // Open modal dialog
  } catch (error) {
    console.error("Error starting quiz:", error);
    alert("Could not load the quiz. Please try again later.");
  }
}

// Show list of categories from the quiz JSON
async function showCategory(subject) {
  // Clear any existing modal content
  document.getElementById("levels").innerHTML = "";
  document.getElementById("questions").innerHTML = "";
  document.getElementById("category").innerHTML = "";

  let categoryHtml = "";

  // Loop through categories and create buttons
  for (const [cat, value] of Object.entries(quizData)) {
    categoryHtml += `<button class="option-button" onclick="selectCategory('${cat}')">${cat}</button>`;
  }

  // Set modal title and insert category buttons
  document.getElementById("quizTitle").innerText = `Quiz: ${subject}`;
  document.getElementById("category").insertAdjacentHTML("beforeend", categoryHtml);
}

// When a category is selected, show the difficulty levels
async function selectCategory(cat) {
  document.getElementById("category").innerHTML = "";

  let levelHtml = "";

  // Get levels for the selected category
  for (const [key, values] of Object.entries(quizData)) {
    if (key === cat) {
      levelData = values;
    }
  }

  // Create buttons for each difficulty level
  for (const [key, values] of Object.entries(levelData.levels)) {
    levelHtml += `<button class="option-button" onclick="selectLevels('${key}')">${key}</button>`;
  }

  // Add a back button
  levelHtml += `<button class="option-button" onclick="showCategory('${subject}')">Back to Category</button>`;

  document.getElementById("quizTitle").innerText = `Quiz: ${subject}`;
  document.getElementById("levels").insertAdjacentHTML("beforeend", levelHtml);
}

// When a level is selected, show the questions
async function selectLevels(levels) {
  document.getElementById("levels").innerHTML = "";
  score = 0;
  clearInterval(timer); // Stop any running timer

  // Get questions for the selected difficulty
  const questions = levelData?.levels?.[levels];

  // Set time limit based on difficulty
  if (levels === "Easy") {
    timeLimit = 20;
  } else if (levels === "Medium") {
    timeLimit = 30;
  } else if (levels === "Hard") {
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

  await showQuestion(); // Show the first question
}

// Display the current question
async function showQuestion() {
  const questionObj = currentQuestions[currentQuestionIndex];
  const modalContent = document.getElementById("questions");
  modalContent.innerHTML = "";

  // Show question number
  document.getElementById("questions").innerText = `Question ${currentQuestionIndex + 1}`;

  // Build question and answer options HTML
  const questionHtml = `
    <div class="question-timer">⏳ Time left: <span id="timeLeft">${timeLimit}</span>s</div>
    <p class="question">${questionObj.question}</p>
    <div id="answer-options">
      ${questionObj.options.map(opt =>
        `<button class="option-button answer-button" onclick="checkAnswer('${opt.replace(/'/g, "\\'")}')">${opt}</button>`
      ).join("")}
    </div>
  `;

  modalContent.insertAdjacentHTML("beforeend", questionHtml);

  await startTimer(); // Start countdown
}

// Timer logic for each question
async function startTimer() {
  let timeRemaining = timeLimit;
  const timeElement = document.getElementById("timeLeft");

  timer = setInterval(() => {
    timeRemaining--;
    if (timeElement) timeElement.textContent = timeRemaining;
    if (timeRemaining <= 0) {
      clearInterval(timer);
      checkAnswer(null); // No answer selected (timeout)
    }
  }, 1000);
}

// Check the selected answer and show result
async function checkAnswer(option) {
  clearInterval(timer); // Stop timer

  const modalContent = document.getElementById("questions");
  const questionObj = currentQuestions[currentQuestionIndex];
  let answerHtml = "";

  // Disable all answer buttons
  let buttons = modalContent.querySelectorAll(".answer-button");
  buttons.forEach((btn) => {
    btn.disabled = true;

    // Highlight correct and selected answer
    if (btn.textContent === questionObj.answer) {
      btn.style.backgroundColor = "#4caf50"; // Green for correct
    } else if (btn.textContent === option) {
      btn.style.backgroundColor = "#f44336"; // Red for wrong
    }
  });

  // Remove old answer message
  const inserted = document.getElementById("answer-text");
  if (inserted) inserted.remove();

  // Create new answer feedback
  if (option === questionObj.answer) {
    score++;
    answerHtml = `<div id="answer-text"><h3>✅ Correct answer: ${questionObj.answer}</h3><p>🎉 Fun fact: ${questionObj.fun_fact ? questionObj.fun_fact : questionObj.explanation}</p></div>`;
  } else if (option === null) {
    answerHtml = `<div id="answer-text"><h3>⏰ Time's up! Correct answer: ${questionObj.answer}</h3></div>`;
  } else {
    answerHtml = `<div id="answer-text"><h3>❌ Oops! Correct answer: ${questionObj.answer}</h3><p>💡 Fun fact: ${questionObj.fun_fact ? questionObj.fun_fact : questionObj.explanation}</p></div>`;
  }

  // Show answer feedback
  modalContent.insertAdjacentHTML("beforeend", answerHtml);

  // Wait 10 seconds, then move to next question
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await nextQuestion();
}

// Go to next question or end quiz
async function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length) {
    await showQuestion();
  } else {
    showQuizEnd(); // Quiz complete
  }
}

// Show final score and restart options
function showQuizEnd() {
  const modalContent = document.getElementById("questions");
  modalContent.innerHTML = `
    <div class="end-quiz">
      <h3>🎉 Quiz Completed!</h3>
      <p>Your Score: <strong>${score}</strong> / ${currentQuestions.length}</p>
      <button class="option-button" onclick="showCategory('${subject}')">🔙 Back to Category</button>
    </div>
  `;
  document.getElementById("quizTitle").innerText = "Quiz Finished";
}

// Close modal and reset state
async function closeModal() {
  document.getElementById("quizModal").style.display = "none";
  document.getElementById("category").innerHTML = "";
  document.getElementById("levels").innerHTML = "";
  document.getElementById("questions").innerHTML = "";

  currentQuestions = [];
  currentQuestionIndex = 0;
  score = 0;

  clearInterval(timer);
}

// Open the modal
async function openModal() {
  document.getElementById("quizModal").style.display = "block";
}

// Close modal if user clicks outside the content box
window.onclick = function (event) {
  const modal = document.getElementById("quizModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
