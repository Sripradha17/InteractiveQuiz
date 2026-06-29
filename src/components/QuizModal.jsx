import { useEffect, useState } from "react";
import ProgressDots from "./ProgressDots";
import AnimatedScore from "./AnimatedScore";
import BotConversation from "./BotConversation";
import Confetti from "./Confetti";
import { CorrectIcon, IncorrectIcon, TimeoutIcon, TrophyIcon, FlameIcon, SoundOnIcon, SoundOffIcon } from "./icons/FeedbackIcons";
import { useSound } from "../hooks/useSound";

const AUTO_ADVANCE_DELAY_MS = 8000;
const STREAK_CONFETTI_EVERY = 3;

function getTimeLimit(level) {
  if (level === "Easy") return 20;
  if (level === "Medium") return 30;
  if (level === "Hard") return 160;
  return 250; // Very Hard / any other custom level name
}

export default function QuizModal({ subject, quizData, onClose }) {
  const sound = useSound();

  const [view, setView] = useState("categories"); // categories | levels | question | end
  const [category, setCategory] = useState(null);
  const [level, setLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [conversationKey, setConversationKey] = useState(0);
  const [confetti, setConfetti] = useState({ burstId: null, count: 0 });

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const currentQuestion = questions[index];
  const timeLimit = level ? getTimeLimit(level) : 0;

  // Countdown timer for the active question; stops the instant the user answers
  useEffect(() => {
    if (view !== "question" || answered || !currentQuestion) return;
    setTimeLeft(timeLimit);
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          handleAnswer(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, index, answered]);

  // Auto-advance to the next question a few seconds after answering
  useEffect(() => {
    if (!answered) return;
    const id = setTimeout(() => handleNext(), AUTO_ADVANCE_DELAY_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, index]);

  // Celebrate a strong finish
  useEffect(() => {
    if (view !== "end" || questions.length === 0) return;
    const passRate = score / questions.length;
    if (passRate >= 0.7) {
      sound.playFanfare();
      setConfetti({ burstId: Date.now(), count: 60 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  function openCategory(catName) {
    sound.playClick();
    setCategory(catName);
    setView("levels");
  }

  function openLevel(levelName) {
    sound.playClick();
    const levelQuestions = quizData[category]?.levels?.[levelName];
    if (!Array.isArray(levelQuestions) || levelQuestions.length === 0) {
      alert("No questions available for this level.");
      return;
    }
    setLevel(levelName);
    setQuestions(levelQuestions);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setResults(new Array(levelQuestions.length).fill(null));
    setAnswered(false);
    setSelectedIndex(null);
    setView("question");
  }

  function backToCategories() {
    setView("categories");
    setCategory(null);
    setLevel(null);
  }

  function handleAnswer(selIndex) {
    if (answered || !currentQuestion) return;
    const correctIndex = currentQuestion.options.indexOf(currentQuestion.answer);
    const isCorrect = selIndex !== null && selIndex === correctIndex;

    setAnswered(true);
    setSelectedIndex(selIndex);
    setResults((prev) => {
      const copy = [...prev];
      copy[index] = isCorrect ? "correct" : "incorrect";
      return copy;
    });
    setConversationKey((k) => k + 1);

    if (isCorrect) {
      setScore((s) => s + 1);
      sound.playCorrect();
      setStreak((s) => {
        const next = s + 1;
        if (next % STREAK_CONFETTI_EVERY === 0) {
          setConfetti({ burstId: Date.now(), count: 24 });
        }
        return next;
      });
    } else {
      setStreak(0);
      sound.playIncorrect();
    }
  }

  function handleNext() {
    sound.playClick();
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setAnswered(false);
      setSelectedIndex(null);
    } else {
      setView("end");
    }
  }

  const correctIndex = currentQuestion ? currentQuestion.options.indexOf(currentQuestion.answer) : -1;
  const fact = currentQuestion ? currentQuestion.fun_fact || currentQuestion.explanation : null;
  const timerPercent = timeLimit ? Math.max(0, (timeLeft / timeLimit) * 100) : 0;

  return (
    <div
      className="modal is-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quizTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <Confetti burstId={confetti.burstId} count={confetti.count} />

        <button
          id="soundToggle"
          className="sound-toggle"
          type="button"
          aria-label={sound.enabled ? "Mute sound effects" : "Unmute sound effects"}
          onClick={sound.toggle}
        >
          {sound.enabled ? <SoundOnIcon /> : <SoundOffIcon />}
        </button>
        <span className="close-button" role="button" tabIndex={0} aria-label="Close quiz" onClick={onClose}>
          &times;
        </span>

        <h2 id="quizTitle">
          {view === "end" ? "Quiz Finished" : `Quiz: ${subject}`}
        </h2>

        {view === "categories" && (
          <div className="category-section">
            {Object.keys(quizData).map((cat) => (
              <button key={cat} className="option-button" onClick={() => openCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {view === "levels" && (
          <div className="level-section">
            {Object.keys(quizData[category]?.levels || {}).map((lvl) => (
              <button key={lvl} className="option-button" onClick={() => openLevel(lvl)}>
                {lvl}
              </button>
            ))}
            <button className="option-button" onClick={backToCategories}>
              Back to Category
            </button>
          </div>
        )}

        {view === "question" && currentQuestion && (
          <div className="question-section">
            <div className="question-block">
              <p className="question-progress">
                {`Question ${index + 1} of ${questions.length}`}
                {streak >= 2 && (
                  <span className="streak-badge" key={`streak-${streak}`}>
                    <FlameIcon /> {streak} streak
                  </span>
                )}
              </p>

              <ProgressDots results={results} currentIndex={index} />

              <div className="question-timer">
                Time left: <span>{timeLeft}</span>s
              </div>
              <div className="timer-bar-track">
                <div
                  className={`timer-bar-fill${timerPercent <= 25 ? " low-time" : ""}`}
                  style={{ width: `${timerPercent}%` }}
                />
              </div>

              <p className="question">{currentQuestion.question}</p>

              <div id="answer-options">
                {currentQuestion.options.map((opt, i) => {
                  const classes = ["option-button", "answer-button"];
                  if (answered && i === correctIndex) classes.push("correct");
                  else if (answered && i === selectedIndex) classes.push("incorrect");
                  return (
                    <button
                      key={i}
                      className={classes.join(" ")}
                      disabled={answered}
                      onClick={() => {
                        sound.playClick();
                        handleAnswer(i);
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div id="answer-text">
                  <h3>
                    {selectedIndex === null ? (
                      <>
                        <TimeoutIcon /> Time's up! Correct answer: {currentQuestion.answer}
                      </>
                    ) : selectedIndex === correctIndex ? (
                      <>
                        <CorrectIcon /> Correct answer: {currentQuestion.answer}
                      </>
                    ) : (
                      <>
                        <IncorrectIcon /> Incorrect. Correct answer: {currentQuestion.answer}
                      </>
                    )}
                  </h3>

                  <BotConversation fact={fact} conversationKey={conversationKey} />

                  <button className="option-button" onClick={handleNext}>
                    {index + 1 >= questions.length ? "See Results" : "Next Question"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {view === "end" && (
          <div className="question-section">
            <div className="end-quiz">
              <TrophyIcon />
              <h3>Quiz Completed!</h3>
              <p>
                Your Score: <AnimatedScore value={score} /> {`/ ${questions.length}`}
              </p>
              <button className="option-button" onClick={backToCategories}>
                Back to Category
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
