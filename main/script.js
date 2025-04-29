let quizData = {}; // Store full JSON globally
let subject = "";
let levelData = {};
let currentQuestions = [];
let currentQuestionIndex = 0;
let questionObj = {};

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
  let modalContent = document.getElementById("category");
  modalContent.innerHTML = "";

  let levelHtml = "";
  for (const [key, values] of Object.entries(quizData)) {
    if (key === cat) {
      levelData = values;
    }
  }

  for (const [key, values] of Object.entries(levelData.levels)) {
    console.log(key);
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

  const questions = levelData?.levels?.[levels];

  if (!Array.isArray(questions) || questions.length === 0) {
    alert("No questions available for this level.");
    return;
  }

  currentQuestions = questions;
  currentQuestionIndex = 0;

  await showQuestion();
}

async function showQuestion() {
  let modalContent = document.getElementById("levels");
  modalContent.innerHTML = "";
  modalContent = document.getElementById("category");
  modalContent.innerHTML = "";
  questionObj = currentQuestions[currentQuestionIndex];

  if (!questionObj) return;

  const { question, options } = questionObj;
  console.log(questionObj);
  let optionsHtml = options
    .map(
      (opt) =>
        `<button class="answer-button" onclick="checkAnswer('${opt}')">${opt}</button>`
    )
    .join("");

  const navigationHtml = `
          <div class="nav-buttons">
            <button class="previous-button" onclick="prevQuestion()" ${
              currentQuestionIndex === 0 ? "disabled" : ""
            }>⬅ Prev</button>
            <button class="next-button" onclick="nextQuestion()" ${
              currentQuestionIndex === currentQuestions.length - 1
                ? "disabled"
                : ""
            }>Next ➡</button>
          </div>
        `;

  document.getElementById("quizTitle").innerText = `Question ${
    currentQuestionIndex + 1
  }`;

  document.getElementById("questions").innerHTML = `
          <p class="question">${question}</p>
          ${optionsHtml}
          ${navigationHtml}
        `;
}

async function checkAnswer(option) {
  let modalContent = document.getElementById("questions");
  let answerHtml = "";
  if (questionObj.answer == option) {
    let inserted = document.getElementById("answer-text");
    if (inserted) {
      inserted.remove();
    }
    console.log(questionObj.answer);
    answerHtml = `<div id="answer-text"><h3 >Correct answer: ${option}</h3><p>Fun fact: ${questionObj.fun_fact}</p></div>`;
  } else {
    let inserted = document.getElementById("answer-text");
    if (inserted) {
      inserted.remove();
    }
    answerHtml = `<div id="answer-text"><h3>Opps! Correct answer: ${option}</h3></div>`;
  }
  modalContent.insertAdjacentHTML("afterend", answerHtml);
}

async function closeModal() {
  document.getElementById("quizModal").style.display = "none";
  // Clear the dynamically added buttons
  const modalContent = document.getElementById("category");
  modalContent.innerHTML = "";
}

async function openModal() {
  document.getElementById("quizModal").style.display = "block";
}

async function nextQuestion() {
  if (currentQuestionIndex < currentQuestions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  }
}

async function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
}

// Optional: Close modal on outside click
window.onclick = function (event) {
  const modal = document.getElementById("quizModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
