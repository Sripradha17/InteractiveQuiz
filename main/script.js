let quizData = {}; // Store full JSON globally
let subject = "";
let levelData = {};
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLimit = 10; // seconds per question

async function startQuiz(subject) {
  try {
    const response = await fetch(`../questions/${subject}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${subject}.json`);
    }
    quizData = await response.json();

    await this.showCategory(subject);
    await openModal();
  } catch (error) {
    console.error("Error starting quiz:", error);
    alert("Could not load the quiz. Please try again later.");
  }
}

async function showCategory(subject) {
  let modalContent = document.getElementById("levels");
  modalContent.innerHTML = "";
  modalContent = document.getElementById("questions");
  modalContent.innerHTML = "";
  modalContent = document.getElementById("category");
  modalContent.innerHTML = "";
  let categoryHtml = "";

  for (const [cat, value] of Object.entries(quizData)) {
    categoryHtml += `<button class="option-button" onclick="selectCategory('${cat}')">${cat}</button>`;
  }

  document.getElementById("quizTitle").innerText = `Quiz: ${subject}`;
  modalContent = document.getElementById("category");
  modalContent.insertAdjacentHTML("beforeend", categoryHtml);
}

async function selectCategory(cat) {
  document.getElementById("category").innerHTML = "";
  let levelHtml = "";
  for (const [key, values] of Object.entries(quizData)) {
    if (key === cat) {
      levelData = values;
    }
  }

  for (const [key, values] of Object.entries(levelData.levels)) {
    levelHtml += `<button class="option-button" onclick="selectLevels('${key}')">${key}</button>`;
  }

  levelHtml += `<button class="option-button" onclick="showCategory('${subject}')">Back to Category</button>`;

  document.getElementById("quizTitle").innerText = `Quiz: ${subject}`;
  modalContent = document.getElementById("levels");
  modalContent.insertAdjacentHTML("beforeend", levelHtml);
}

async function selectLevels(levels) {
  let modalContent = document.getElementById("levels");
  modalContent.innerHTML = "";
  score=0;
  clearInterval(timer);

  const questions = levelData?.levels?.[levels];

  if (levels === "Easy") {
    timeLimit = 10;
  } else if (levels === "Medium") {
    timeLimit = 20;
  } else if (levels === "Hard") {
    timeLimit = 60;
  } else {
    timeLimit = 190;
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    alert("No questions available for this level.");
    return;
  }

  currentQuestions = questions;
  currentQuestionIndex = 0;

  await showQuestion();
}

async function showQuestion() {

  const questionObj = currentQuestions[currentQuestionIndex];
  const modalContent = document.getElementById("questions");
  modalContent.innerHTML = "";

  document.getElementById("questions").innerText = `Question ${
    currentQuestionIndex + 1
  }`;

  const questionHtml = `
      <div class="question-timer">⏳ Time left: <span id="timeLeft">${timeLimit}</span>s</div>
      <p class="question">${questionObj.question}</p>
      <div id="answer-options">
        ${questionObj.options
          .map(
            (opt) =>
              `<button class="option-button answer-button" onclick="checkAnswer('${opt.replace(
                /'/g,
                "\\'"
              )}')">${opt}</button>`
          )
          .join("")}
      </div>
    `;

  modalContent.insertAdjacentHTML("beforeend", questionHtml);
  await startTimer();
}

async function startTimer() {
  let timeRemaining = timeLimit;
  const timeElement = document.getElementById("timeLeft");

  timer = setInterval(() => {
    timeRemaining--;
    if (timeElement) timeElement.textContent = timeRemaining;
    if (timeRemaining <= 0) {
      clearInterval(timer);
      checkAnswer(null); // no answer given
    }
  }, 1000);
}

async function checkAnswer(option) {
  clearInterval(timer);

  const modalContent = document.getElementById("questions");
  const questionObj = currentQuestions[currentQuestionIndex];
  let answerHtml = "";
  let buttons = modalContent.querySelectorAll(".answer-button");

  buttons.forEach((btn) => {
    btn.disabled = true;

    if (btn.textContent === questionObj.answer) {
      btn.style.backgroundColor = "#4caf50"; // Green
    } else if (btn.textContent === option) {
      btn.style.backgroundColor = "#f44336"; // Red
    }
  });

  const inserted = document.getElementById("answer-text");
  if (inserted) inserted.remove();

  if (option === questionObj.answer) {
    score++;
    answerHtml = `<div id="answer-text"><h3>✅ Correct answer: ${
      questionObj.answer
    }</h3><p>🎉 Fun fact: ${
      questionObj.fun_fact ? questionObj.fun_fact : questionObj.explanation
    }</p></div>`;
  } else if (option === null) {
    answerHtml = `<div id="answer-text"><h3>⏰ Time's up! Correct answer: ${questionObj.answer}</h3></div>`;
  } else {
    answerHtml = `<div id="answer-text"><h3>❌ Oops! Correct answer: ${
      questionObj.answer
    }</h3><p>💡 Fun fact: ${
      questionObj.fun_fact ? questionObj.fun_fact : questionObj.explanation
    }</p></div>`;
  }

  modalContent.insertAdjacentHTML("beforeend", answerHtml);

  // Wait 5 seconds and go to next
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await nextQuestion();
}

async function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length) {
    await showQuestion();
  } else {
    showQuizEnd();
  }
}

function showQuizEnd() {
  const modalContent = document.getElementById("questions");
  modalContent.innerHTML = `<div class="end-quiz">
      <h3>🎉 Quiz Completed!</h3>
      <p>Your Score: <strong>${score}</strong> / ${currentQuestions.length}</p>
      <button class="option-button" onclick="showCategory('${subject}')">🔙 Back to Category</button></div>
    `;
  document.getElementById("quizTitle").innerText = "Quiz Finished";
}

async function closeModal() {
  document.getElementById("quizModal").style.display = "none";
  document.getElementById("category").innerHTML = "";
  document.getElementById("levels").innerHTML = "";
  document.getElementById("questions").innerHTML = "";

  // Reset globals if needed
  currentQuestions = [];
  currentQuestionIndex = 0;
  score = 0;

  // Clear timer if running
  clearInterval(timer);
}

async function openModal() {
  document.getElementById("quizModal").style.display = "block";
}

// Optional: Close modal on outside click
window.onclick = function (event) {
  const modal = document.getElementById("quizModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
